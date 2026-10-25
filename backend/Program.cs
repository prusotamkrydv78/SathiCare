using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using SathiCare.Api.Common;
using SathiCare.Api.Data;
using SathiCare.Api.Hubs;
using SathiCare.Api.Middleware;
using SathiCare.Api.Repositories;
using SathiCare.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// ----- Data access (repository pattern over EF Core + SQL Server) -----
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// ----- Application services -----
builder.Services.AddSingleton<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPeriodService, PeriodService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

// ----- Auth: JWT everywhere — from the Authorization header (SignalR hub) or the httpOnly cookie (API) -----
builder.Services
    .AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "sathicare-api",
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "sathicare-client",
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]
                    ?? "sathicare-demo-access-secret-change-me-please-32")),
            ValidateLifetime = true,
            RoleClaimType = "role",
            NameClaimType = "sub"
        };
        // Browsers send the token in the httpOnly "accessToken" cookie (same-origin via the Next.js proxy).
        options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
        {
            OnMessageReceived = ctx =>
            {
                if (string.IsNullOrEmpty(ctx.Token) && ctx.Request.Cookies.TryGetValue("accessToken", out var cookieToken))
                    ctx.Token = cookieToken;
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// ----- CORS (frontend runs same-origin through the Next.js proxy; this is for direct access) -----
builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy => policy
        .WithOrigins(builder.Configuration.GetSection("Cors:Origins").Get<string[]>() ?? Array.Empty<string>())
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});
builder.Services.AddSignalR();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

var app = builder.Build();

// Migrate + seed demo data on startup.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
    if (!await db.Users.AnyAsync())
        await DemoSeeder.ResetAndSeedAsync(db);
}

app.UseMiddleware<ErrorHandlingMiddleware>();
if (app.Environment.IsDevelopment()) app.MapOpenApi();

app.UseCors("frontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<ConsultationHub>("/hubs/consultation");

app.Run();

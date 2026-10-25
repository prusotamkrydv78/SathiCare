using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SathiCare.Api.Common;
using SathiCare.Api.Data;
using SathiCare.Api.Dtos;

namespace SathiCare.Api.Controllers;

[ApiController]
[Route("api/demo")]
public class DemoController : ControllerBase
{
    private readonly IServiceProvider _services;

    public DemoController(IServiceProvider services) => _services = services;

    /// <summary>Public demo account list for judges/presenters.</summary>
    [HttpGet("accounts")]
    public IActionResult Accounts() => Ok(ApiResult.Ok(new DemoAccountsDto(DemoSeeder.DemoPassword, new List<DemoAccountDto>
    {
        new("Patient", "sita@demo.np", "user"),
        new("Patient (pregnant)", "gita@demo.np", "user"),
        new("Doctor", "dr.anita@demo.np", "doctor"),
        new("Admin", "admin@demo.np", "admin")
    })));

    /// <summary>Wipes and reseeds all demo data. Demo logins keep working (stable ids).</summary>
    [HttpPost("reset")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Reset()
    {
        await using var scope = _services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await DemoSeeder.ResetAndSeedAsync(db);
        return Ok(ApiResult.Ok(new { users = 9, doctors = 6 }, "Demo data reset"));
    }
}

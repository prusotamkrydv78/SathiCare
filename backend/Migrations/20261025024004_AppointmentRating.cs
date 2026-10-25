using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SathiCare.Api.Migrations
{
    /// <inheritdoc />
    public partial class AppointmentRating : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Rating",
                table: "Appointments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RatingGiven",
                table: "Appointments",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rating",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "RatingGiven",
                table: "Appointments");
        }
    }
}

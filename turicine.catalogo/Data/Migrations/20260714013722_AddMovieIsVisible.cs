using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Turicine.Catalogo.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddMovieIsVisible : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsVisible",
                table: "Movies",
                type: "boolean",
                nullable: false,
                // Existing movies stay visible; new rows also default to visible.
                defaultValue: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsVisible",
                table: "Movies");
        }
    }
}

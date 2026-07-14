using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Turicine.Catalogo.Data.Migrations
{
    /// <inheritdoc />
    public partial class RenameVenueWhatsappNumber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Rename preserves existing data; then tighten the length to 40.
            migrationBuilder.RenameColumn(
                name: "WhatsappUrl",
                table: "Venues",
                newName: "WhatsappNumber");

            // Old values held full URLs; they are no longer valid as numbers and may
            // exceed the new length. Clear anything that won't fit.
            migrationBuilder.Sql(
                "UPDATE \"Venues\" SET \"WhatsappNumber\" = NULL WHERE length(\"WhatsappNumber\") > 40;");

            migrationBuilder.AlterColumn<string>(
                name: "WhatsappNumber",
                table: "Venues",
                type: "character varying(40)",
                maxLength: 40,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500,
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "WhatsappNumber",
                table: "Venues",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(40)",
                oldMaxLength: 40,
                oldNullable: true);

            migrationBuilder.RenameColumn(
                name: "WhatsappNumber",
                table: "Venues",
                newName: "WhatsappUrl");
        }
    }
}

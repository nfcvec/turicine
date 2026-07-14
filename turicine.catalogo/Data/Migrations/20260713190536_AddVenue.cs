using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Turicine.Catalogo.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddVenue : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Venues",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Address = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    MapsUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    WhatsappUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    PhoneNumber = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Venues", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MovieVenue",
                columns: table => new
                {
                    MoviesId = table.Column<Guid>(type: "uuid", nullable: false),
                    VenuesId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovieVenue", x => new { x.MoviesId, x.VenuesId });
                    table.ForeignKey(
                        name: "FK_MovieVenue_Movies_MoviesId",
                        column: x => x.MoviesId,
                        principalTable: "Movies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MovieVenue_Venues_VenuesId",
                        column: x => x.VenuesId,
                        principalTable: "Venues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MovieVenue_VenuesId",
                table: "MovieVenue",
                column: "VenuesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MovieVenue");

            migrationBuilder.DropTable(
                name: "Venues");
        }
    }
}

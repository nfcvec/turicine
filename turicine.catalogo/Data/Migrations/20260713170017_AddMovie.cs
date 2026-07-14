using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Turicine.Catalogo.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddMovie : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CarouselOrder",
                table: "Images",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "MovieId",
                table: "Images",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Movies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Synopsis = table.Column<string>(type: "text", nullable: true),
                    Category = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    DurationSeconds = table.Column<int>(type: "integer", nullable: false),
                    Directors = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Cast = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Movies", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Images_MovieId",
                table: "Images",
                column: "MovieId");

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Movies_MovieId",
                table: "Images",
                column: "MovieId",
                principalTable: "Movies",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Images_Movies_MovieId",
                table: "Images");

            migrationBuilder.DropTable(
                name: "Movies");

            migrationBuilder.DropIndex(
                name: "IX_Images_MovieId",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "CarouselOrder",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "MovieId",
                table: "Images");
        }
    }
}

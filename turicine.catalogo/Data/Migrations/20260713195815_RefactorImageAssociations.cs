using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Turicine.Catalogo.Data.Migrations
{
    /// <inheritdoc />
    public partial class RefactorImageAssociations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1) New venue logo column.
            migrationBuilder.AddColumn<Guid>(
                name: "LogoImageId",
                table: "Venues",
                type: "uuid",
                nullable: true);

            // 2) New association table.
            migrationBuilder.CreateTable(
                name: "MovieImages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MovieId = table.Column<Guid>(type: "uuid", nullable: false),
                    ImageId = table.Column<Guid>(type: "uuid", nullable: false),
                    CarouselOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovieImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MovieImages_Images_ImageId",
                        column: x => x.ImageId,
                        principalTable: "Images",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MovieImages_Movies_MovieId",
                        column: x => x.MovieId,
                        principalTable: "Movies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Venues_LogoImageId",
                table: "Venues",
                column: "LogoImageId");

            migrationBuilder.CreateIndex(
                name: "IX_MovieImages_ImageId",
                table: "MovieImages",
                column: "ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_MovieImages_MovieId_ImageId",
                table: "MovieImages",
                columns: new[] { "MovieId", "ImageId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Venues_Images_LogoImageId",
                table: "Venues",
                column: "LogoImageId",
                principalTable: "Images",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            // 3) Relocate existing carousel links (Images.MovieId/CarouselOrder) into MovieImages.
            migrationBuilder.Sql(
                "INSERT INTO \"MovieImages\" (\"Id\", \"MovieId\", \"ImageId\", \"CarouselOrder\") " +
                "SELECT gen_random_uuid(), \"MovieId\", \"Id\", \"CarouselOrder\" " +
                "FROM \"Images\" WHERE \"MovieId\" IS NOT NULL;");

            // 4) Drop the old direct columns now that data is migrated.
            migrationBuilder.DropForeignKey(
                name: "FK_Images_Movies_MovieId",
                table: "Images");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Re-add the direct columns and copy links back from MovieImages.
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

            migrationBuilder.Sql(
                "UPDATE \"Images\" i SET \"MovieId\" = mi.\"MovieId\", \"CarouselOrder\" = mi.\"CarouselOrder\" " +
                "FROM \"MovieImages\" mi WHERE mi.\"ImageId\" = i.\"Id\";");

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

            migrationBuilder.DropForeignKey(
                name: "FK_Venues_Images_LogoImageId",
                table: "Venues");

            migrationBuilder.DropTable(
                name: "MovieImages");

            migrationBuilder.DropIndex(
                name: "IX_Venues_LogoImageId",
                table: "Venues");

            migrationBuilder.DropColumn(
                name: "LogoImageId",
                table: "Venues");
        }
    }
}

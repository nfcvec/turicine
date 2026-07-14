using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Turicine.Catalogo.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Category table + unique name index.
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Categories_Name",
                table: "Categories",
                column: "Name",
                unique: true);

            // 2. Seed distinct categories from the existing free-text column,
            //    trimming and collapsing internal whitespace (e.g. the double space in
            //    "C. COMPETENCIA  DE LARGOMETRAJES").
            migrationBuilder.Sql(
                "INSERT INTO \"Categories\" (\"Id\", \"Name\") " +
                "SELECT gen_random_uuid(), n FROM (" +
                "  SELECT DISTINCT regexp_replace(trim(\"Category\"), '\\s+', ' ', 'g') AS n " +
                "  FROM \"Movies\"" +
                ") AS distinct_names;");

            // 3. Add the FK column as nullable so existing rows can be backfilled.
            migrationBuilder.AddColumn<Guid>(
                name: "CategoryId",
                table: "Movies",
                type: "uuid",
                nullable: true);

            // 4. Backfill each movie's CategoryId by matching the normalized name.
            migrationBuilder.Sql(
                "UPDATE \"Movies\" m SET \"CategoryId\" = c.\"Id\" " +
                "FROM \"Categories\" c " +
                "WHERE c.\"Name\" = regexp_replace(trim(m.\"Category\"), '\\s+', ' ', 'g');");

            // 5. Now enforce NOT NULL, index, FK and drop the old column.
            migrationBuilder.AlterColumn<Guid>(
                name: "CategoryId",
                table: "Movies",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Movies_CategoryId",
                table: "Movies",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Movies_Categories_CategoryId",
                table: "Movies",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.DropColumn(
                name: "Category",
                table: "Movies");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Restore the free-text column from the related category name.
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Movies",
                type: "character varying(120)",
                maxLength: 120,
                nullable: true);

            migrationBuilder.Sql(
                "UPDATE \"Movies\" m SET \"Category\" = c.\"Name\" " +
                "FROM \"Categories\" c WHERE c.\"Id\" = m.\"CategoryId\";");

            migrationBuilder.AlterColumn<string>(
                name: "Category",
                table: "Movies",
                type: "character varying(120)",
                maxLength: 120,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(120)",
                oldMaxLength: 120,
                oldNullable: true);

            migrationBuilder.DropForeignKey(
                name: "FK_Movies_Categories_CategoryId",
                table: "Movies");

            migrationBuilder.DropIndex(
                name: "IX_Movies_CategoryId",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Movies");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}

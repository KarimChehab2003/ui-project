using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Elearning.Migrations
{
    /// <inheritdoc />
    public partial class demo2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Submission",
                table: "StudentQuizzes");

            migrationBuilder.DropColumn(
                name: "Submission",
                table: "StudentAssignments");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Submission",
                table: "StudentQuizzes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Submission",
                table: "StudentAssignments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}

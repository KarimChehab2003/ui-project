using Elearning.Data.ElearningAPI.Models;
using Elearning.Dtos;
using Elearning.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Elearning.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentQuizController : ControllerBase
    {
        private readonly ElearningContext _context;

        public StudentQuizController(ElearningContext context)
        {
            _context = context;
        }

        [HttpPost("{studentId}/{quizId}")]
        public async Task<IActionResult> SubmitQuiz(int studentId, int quizId)
        {
            var student = await _context.Students.FindAsync(studentId);
            var quiz = await _context.Quizzes.FindAsync(quizId);
            if (student == null || quiz == null) return NotFound();

            var submission = new StudentQuiz
            {
                StudentId = studentId,
                QuizId = quizId,
            };

            _context.StudentQuizzes.Add(submission);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("{submissionId}/grade")]
        public async Task<IActionResult> GradeSubmission(int submissionId, [FromBody] GradeDTO gradeDto)
        {
            var submission = await _context.StudentQuizzes.FindAsync(submissionId);
            if (submission == null) return NotFound();

            submission.Grade = gradeDto.Grade;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

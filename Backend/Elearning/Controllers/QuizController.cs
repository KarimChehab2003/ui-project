using Elearning.Data.ElearningAPI.Models;
using Elearning.Dtos;
using Elearning.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Elearning.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizController : ControllerBase
    {
        private readonly ElearningContext _context;

        public QuizController(ElearningContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AssignmentDTO>>> GetQuizzes()
        {
            var quizzes = await _context.Quizzes
                .Include(a => a.Course)
                .Select(a => new QuizDTO
                {
                    Id = a.Id,
                    Title = a.Title,
                    Description = a.Description,
                    CourseId = a.CourseId
                })
                .ToListAsync();

            return Ok(quizzes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<QuizDTO>> GetQuiz(int id)
        {
            var quiz = await _context.Quizzes
                .Include(a => a.Course)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (quiz == null) return NotFound();

            return new QuizDTO
            {
                Id = quiz.Id,
                Title = quiz.Title,
                Description = quiz.Description,
                CourseId = quiz.CourseId
            };
        }

        [HttpPost]
        public async Task<ActionResult<Quiz>> CreateQuiz(QuizDTO quizDto)
        {
            var course = await _context.Courses.FindAsync(quizDto.CourseId);
            if (course == null) return NotFound("Course not found");

            var quiz = new Quiz
            {
                Title = quizDto.Title,
                Description = quizDto.Description,
                CourseId = quizDto.CourseId
            };

            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetQuiz), new { id = quiz.Id }, quiz);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuiz(int id, QuizDTO quizDto)
        {
            var quiz = await _context.Quizzes.FindAsync(id);
            if (quiz == null) return NotFound();

            quiz.Title = quizDto.Title;
            quiz.Description = quizDto.Description;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuiz(int id)
        {
            var quiz = await _context.Quizzes.FindAsync(id);
            if (quiz == null) return NotFound();

            _context.Quizzes.Remove(quiz);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{quizId}/assign-student/{studentId}")]

        public async Task<IActionResult> AssignStudentToQuiz(int quizId, int studentId)
        {
            var quiz = await _context.Quizzes
                .Include(a => a.StudentQuizzes)
                .FirstOrDefaultAsync(a => a.Id == quizId);

            var student = await _context.Students.FindAsync(studentId);

            if (quiz == null || student == null)
                return NotFound();

            if (!quiz.StudentQuizzes.Any(sa => sa.StudentId == studentId))
            {
                var studentQuiz = new StudentQuiz
                {
                    StudentId = studentId,
                    QuizId = quizId
                };

                quiz.StudentQuizzes.Add(studentQuiz);
                await _context.SaveChangesAsync();
            }

            return NoContent();
        }
    }
}

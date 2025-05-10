using Elearning.Data.ElearningAPI.Models;
using Elearning.Dtos;
using Elearning.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Elearning.Controllers
{
    [Route("api/submissions")]
    [ApiController]
    public class StudentAssignmentController : ControllerBase
    {
        private readonly ElearningContext _context;

        public StudentAssignmentController(ElearningContext context)
        {
            _context = context;
        }

        [HttpPost("{studentId}/{assignmentId}")]
        public async Task<IActionResult> SubmitAssignment(int studentId, int assignmentId, [FromBody] SubmissionDTO submissionDto)
        {
            var student = await _context.Students.FindAsync(studentId);
            var assignment = await _context.Assignments.FindAsync(assignmentId);
            if (student == null || assignment == null) return NotFound();

            var submission = new StudentAssignment
            {
                StudentId = studentId,
                AssignmentId = assignmentId,
                Submission = submissionDto.Content
            };

            _context.StudentAssignments.Add(submission);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("{submissionId}/grade")]
        public async Task<IActionResult> GradeSubmission(int submissionId, [FromBody] GradeDTO gradeDto)
        {
            var submission = await _context.StudentAssignments.FindAsync(submissionId);
            if (submission == null) return NotFound();

            submission.Grade = gradeDto.Grade;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
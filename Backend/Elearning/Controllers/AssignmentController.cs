using Elearning.Data.ElearningAPI.Models;
using Elearning.Dtos;
using Elearning.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Elearning.Controllers
{
    [Route("api/assignments")]
    [ApiController]
    public class AssignmentController : ControllerBase
    {
        private readonly ElearningContext _context;

        public AssignmentController(ElearningContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AssignmentDTO>>> GetAssignments()
        {
            var assignments = await _context.Assignments
                .Include(a => a.Course)
                .Select(a => new AssignmentDTO
                {
                    Id = a.Id,
                    Title = a.Title,
                    Description = a.Description,
                    CourseId = a.CourseId
                })
                .ToListAsync();

            return Ok(assignments);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AssignmentDTO>> GetAssignment(int id)
        {
            var assignment = await _context.Assignments
                .Include(a => a.Course)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (assignment == null) return NotFound();

            return new AssignmentDTO
            {
                Id = assignment.Id,
                Title = assignment.Title,
                Description = assignment.Description,
                CourseId = assignment.CourseId
            };
        }

        [HttpPost]
        public async Task<ActionResult<Assignment>> CreateAssignment(AssignmentDTO assignmentDto)
        {
            var course = await _context.Courses.FindAsync(assignmentDto.CourseId);
            if (course == null) return NotFound("Course not found");

            var assignment = new Assignment
            {
                Title = assignmentDto.Title,
                Description = assignmentDto.Description,
                CourseId = assignmentDto.CourseId
            };

            _context.Assignments.Add(assignment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAssignment), new { id = assignment.Id }, assignment);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAssignment(int id, AssignmentDTO assignmentDto)
        {
            var assignment = await _context.Assignments.FindAsync(id);
            if (assignment == null) return NotFound();

            assignment.Title = assignmentDto.Title;
            assignment.Description = assignmentDto.Description;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAssignment(int id)
        {
            var assignment = await _context.Assignments.FindAsync(id);
            if (assignment == null) return NotFound();

            _context.Assignments.Remove(assignment);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
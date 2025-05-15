using Elearning.Data.ElearningAPI.Models;
using Elearning.Dtos;
using Elearning.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Elearning.Controllers
{
    [Route("api/studentsPending")]
    [ApiController]
    public class StudentPendingController : ControllerBase
    {
        private readonly ElearningContext _context;

        public StudentPendingController(ElearningContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentPendingDTO>>> GetStudents()
        {
            var students = await _context.StudentsPending
                .Select(s => new StudentPendingDTO
                {
                    Id = s.Id,
                    Name = s.Name,
                    Email = s.Email,
                    Password = s.Password,
                })
                .ToListAsync();

            return Ok(students);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StudentPendingDTO>> GetStudent(int id)
        {
            var student = await _context.StudentsPending
                .FirstOrDefaultAsync(s => s.Id == id);

            if (student == null) return NotFound();

            return new StudentPendingDTO
            {
                Id = student.Id,
                Name = student.Name,
                Email = student.Email,
                Password = student.Password,
            };
        }

        [HttpGet("check-email")]
        public async Task<ActionResult<bool>> CheckEmail([FromQuery] string email)
        {
            var student = await _context.StudentsPending.FirstOrDefaultAsync(s => s.Email == email);
            return (student != null);
        }

        [HttpPost]
        public async Task<ActionResult<StudentPending>> CreateStudent(StudentPendingDTO studentPendingDto)
        {
            var student = new StudentPending
            {
                Name = studentPendingDto.Name,
                Email = studentPendingDto.Email,
                Password = studentPendingDto.Password,
            };

            _context.StudentsPending.Add(student);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, student);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.StudentsPending.FindAsync(id);
            if (student == null)
            {
                return NotFound();
            }

            _context.StudentsPending.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}


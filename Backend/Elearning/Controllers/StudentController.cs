using Elearning.Data.ElearningAPI.Models;
using Elearning.Dtos;
using Elearning.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Elearning.Controllers
{
    [Route("api/students")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly ElearningContext _context;

        public StudentController(ElearningContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentDTO>>> GetStudents()
        {
            var students = await _context.Students
                .Include(s => s.CoursesEnrolled)
                .Select(s => new StudentDTO
                {
                    Id = s.Id,
                    Name = s.Name,
                    Email = s.Email,
                    CourseIds = s.CoursesEnrolled.Select(c => c.Id).ToList(),
                    Password = s.Password,
                })
                .ToListAsync();

            return Ok(students);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StudentDTO>> GetStudent(int id)
        {
            var student = await _context.Students
                .Include(s => s.CoursesEnrolled)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (student == null) return NotFound();

            return new StudentDTO
            {
                Id = student.Id,
                Name = student.Name,
                Email = student.Email,
                CourseIds = student.CoursesEnrolled.Select(c => c.Id).ToList(),
                Password = student.Password,
            };
        }

        [HttpPost]
        public async Task<ActionResult<Student>> CreateStudent(StudentDTO studentDto)
        {
            var student = new Student
            {
                Name = studentDto.Name,
                Email = studentDto.Email,
                Password = studentDto.Password,
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, student);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, StudentDTO studentDto)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();

            student.Name = studentDto.Name;
            student.Email = studentDto.Email;
            student.Password = studentDto.Password;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{studentId}/enroll/{courseId}")]
        public async Task<IActionResult> EnrollStudent(int studentId, int courseId)
        {
            var student = await _context.Students.Include(s => s.CoursesEnrolled).FirstOrDefaultAsync(s => s.Id == studentId);
            var course = await _context.Courses.FindAsync(courseId);
            if (student == null || course == null) return NotFound();

            student.CoursesEnrolled.Add(course);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}


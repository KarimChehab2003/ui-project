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
 public class CourseController : ControllerBase
    {
        private readonly ElearningContext _context;

        public CourseController(ElearningContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseDTO>>> GetCourses()
        {
            var courses = await _context.Courses
                .Include(c => c.Instructor)
                .Include(c => c.StudentsEnrolled)
                .Include(c => c.Assignments)
                .Include(c => c.Quizzes)
                .Include(c=>c.lectures)
                .Select(c => new CourseDTO
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description,
                    InstructorId = c.InstructorId,
                    StudentIds = c.StudentsEnrolled.Select(s => s.Id).ToList(),
                    AssignmentIds = c.Assignments.Select(a => a.Id).ToList(),
                    DurationInHours = c.DurationInHours ?? 0,
                    SectionCount = c.SectionCount,
                    LectureCount = c.LectureCount,
                    Level = c.Level,
                    lectureIDS = c.lectures.Select(a => a.Id).ToList(),
                    QuizIds = c.Quizzes.Select(a => a.Id).ToList(),
                })
                .ToListAsync();

            return Ok(courses);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CourseDTO>> GetCourse(int id)
        {
            var course = await _context.Courses
                .Include(c => c.Instructor)
                .Include(c => c.StudentsEnrolled)
                .Include(c => c.Assignments)
                .Include(c => c.Quizzes)
                .Include(c => c.lectures)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (course == null) return NotFound();

            return new CourseDTO
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                InstructorId = course.InstructorId,
                StudentIds = course.StudentsEnrolled.Select(s => s.Id).ToList(),
                AssignmentIds = course.Assignments.Select(a => a.Id).ToList(),
                DurationInHours = course.DurationInHours ?? 0,
                SectionCount = course.SectionCount,
                LectureCount = course.LectureCount,
                Level = course.Level,
                lectureIDS = course.lectures.Select(a=>a.Id).ToList(),
                QuizIds = course.Quizzes.Select(a => a.Id).ToList()
            };
        }

        [HttpPost]
        public async Task<ActionResult<Course>> CreateCourse(CourseDTO courseDto)
        {
            var instructor = await _context.Instructors.FindAsync(courseDto.InstructorId);
            if (instructor == null) return NotFound("Instructor not found");

            var course = new Course
            {
                Title = courseDto.Title,
                Description = courseDto.Description,
                InstructorId = courseDto.InstructorId,
                DurationInHours = courseDto.DurationInHours,
                SectionCount = courseDto.SectionCount,
                LectureCount = courseDto.LectureCount,
                Level = courseDto.Level
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCourse), new { id = course.Id }, new CourseDTO
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                InstructorId = course.InstructorId,
                StudentIds = course.StudentsEnrolled.Select(s => s.Id).ToList(),
                AssignmentIds = course.Assignments.Select(a => a.Id).ToList(),
                DurationInHours = course.DurationInHours ?? 0,
                SectionCount = course.SectionCount,
                LectureCount = course.LectureCount,
                Level = course.Level,
                lectureIDS = course.lectures.Select(a => a.Id).ToList(),
                QuizIds = course.Quizzes.Select(a => a.Id).ToList()
            });

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCourse(int id, CourseDTO courseDto)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return NotFound();

            course.Title = courseDto.Title;
            course.Description = courseDto.Description;
            course.InstructorId = courseDto.InstructorId;
            course.DurationInHours = courseDto.DurationInHours;
            course.SectionCount = courseDto.SectionCount;
            course.LectureCount = courseDto.LectureCount;
            course.Level = courseDto.Level;


            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return NotFound();

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{courseId}/assign-student/{studentId}")]
    
        public async Task<IActionResult> AssignStudentToCourse(int courseId, int studentId)
        {
            var course = await _context.Courses
                .Include(c => c.StudentsEnrolled)
                .FirstOrDefaultAsync(c => c.Id == courseId);
            var student = await _context.Students.FindAsync(studentId);

            if (course == null || student == null) return NotFound();

            if (course.StudentsEnrolled == null)
            {
                course.StudentsEnrolled = new List<Student>();
            }

            // Prevent duplicate enrollment
            if (!course.StudentsEnrolled.Any(s => s.Id == studentId))
            {
                course.StudentsEnrolled.Add(student);
                await _context.SaveChangesAsync();
            }

            return NoContent();
        }

    }
}

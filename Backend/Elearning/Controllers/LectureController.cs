// Controllers/LectureController.cs
using Elearning.Data.ElearningAPI.Models;
using Elearning.Dtos;
using Elearning.Models;
using Elearning.Models.Elearning.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Elearning.Controllers
{
    [Route("api/lectures")]
    [ApiController]
    public class LectureController : ControllerBase
    {
        private readonly ElearningContext _context;

        public LectureController(ElearningContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LectureDTO>>> GetLectures()
        {
            var lectures = await _context.Lectures
                .Include(l => l.Course)
                .Select(l => new LectureDTO
                {
                    Id = l.Id,
                    Title = l.Title,
                    Description = l.Description,
                    CourseId = l.CourseId
                })
                .ToListAsync();

            return Ok(lectures);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LectureDTO>> GetLecture(int id)
        {
            var lecture = await _context.Lectures
                .Include(l => l.Course)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (lecture == null)
                return NotFound();

            return new LectureDTO
            {
                Id = lecture.Id,
                Title = lecture.Title,
                Description = lecture.Description,
                CourseId = lecture.CourseId
            };
        }

        [HttpPost]
        public async Task<ActionResult<Lecture>> CreateLecture(LectureDTO lectureDto)
        {
            var course = await _context.Courses.FindAsync(lectureDto.CourseId);
            if (course == null)
                return NotFound("Course not found");

            var lecture = new Lecture
            {
                Title = lectureDto.Title,
                Description = lectureDto.Description,
                CourseId = lectureDto.CourseId
            };

            _context.Lectures.Add(lecture);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLecture), new { id = lecture.Id }, lecture);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLecture(int id, LectureDTO lectureDto)
        {
            var lecture = await _context.Lectures.FindAsync(id);
            if (lecture == null)
                return NotFound();

            lecture.Title = lectureDto.Title;
            lecture.Description = lectureDto.Description;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLecture(int id)
        {
            var lecture = await _context.Lectures.FindAsync(id);
            if (lecture == null)
                return NotFound();

            _context.Lectures.Remove(lecture);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

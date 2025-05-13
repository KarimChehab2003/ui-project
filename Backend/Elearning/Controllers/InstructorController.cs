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
    
    public class InstructorController : ControllerBase
    {
        private readonly ElearningContext _context;

        public InstructorController(ElearningContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<InstructorDTO>>> GetInstructors()
        {
            var instructors = await _context.Instructors
                .Include(i => i.CoursesCreated)
                .Select(i => new InstructorDTO
                {
                    Id = i.Id,
                    Name = i.Name,
                    Email = i.Email,
                    Password = i.Password,
                })
                .ToListAsync();

            return Ok(instructors);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<InstructorDTO>> GetInstructor(int id)
        {
            var instructor = await _context.Instructors
                .Include(i => i.CoursesCreated)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (instructor == null) return NotFound();

            return new InstructorDTO
            {
                Id = instructor.Id,
                Name = instructor.Name,
                Email = instructor.Email,
                Password = instructor.Password,
             
            };
        }

        [HttpPost]
        public async Task<ActionResult<Instructor>> CreateInstructor(InstructorDTO instructorDto)
        {
            var instructor = new Instructor
            {
                Name = instructorDto.Name,
                Email = instructorDto.Email,
                Password = instructorDto.Password,
            };


            _context.Instructors.Add(instructor);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInstructor), new { id = instructor.Id }, instructor);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInstructor(int id, InstructorDTO instructorDto)
        {
            var instructor = await _context.Instructors.FindAsync(id);
            if (instructor == null) return NotFound();

            instructor.Name = instructorDto.Name;
            instructor.Email = instructorDto.Email;
            instructor.Password = instructorDto.Password;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInstructor(int id)
        {
            var instructor = await _context.Instructors.FindAsync(id);
            if (instructor == null) return NotFound();

            _context.Instructors.Remove(instructor);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

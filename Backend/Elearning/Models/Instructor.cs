using System.ComponentModel.DataAnnotations;

namespace Elearning.Models
{
    public class Instructor
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        public List<Course> CoursesCreated { get; set; } = new();
    }
}

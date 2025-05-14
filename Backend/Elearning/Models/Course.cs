using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Elearning.Models
{
    public class Course
    {
        public int Id { get; set; }

        [Required, MaxLength(200)]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }
        
        // Added these attributes for more details
        public int DurationInHours { get; set; }
        public string Level { get; set; }
        public int SectionCount { get; set; }
        public int LectureCount { get; set; }

        [ForeignKey("Instructor")]
        public int InstructorId { get; set; }
        public Instructor Instructor { get; set; }

        public List<Student> StudentsEnrolled { get; set; } = new();
        public List<Assignment> Assignments { get; set; } = new();
    }
}

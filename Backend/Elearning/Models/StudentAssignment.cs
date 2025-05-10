using System.ComponentModel.DataAnnotations.Schema;

namespace Elearning.Models
{

    public class StudentAssignment
    {
        [ForeignKey("Student")]
        public int StudentId { get; set; }
        public Student Student { get; set; }

        [ForeignKey("Assignment")]
        public int AssignmentId { get; set; }
        public Assignment Assignment { get; set; }

        public string Submission { get; set; }
        public double? Grade { get; set; }
    }
}

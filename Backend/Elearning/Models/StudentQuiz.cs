using System.ComponentModel.DataAnnotations.Schema;

namespace Elearning.Models
{

    public class StudentQuiz
    {
        [ForeignKey("Student")]
        public int StudentId { get; set; }
        public Student Student { get; set; }

        [ForeignKey("Quiz")]
        public int QuizId { get; set; }
        public Quiz Quiz { get; set; }
        public double? Grade { get; set; }
    }
}

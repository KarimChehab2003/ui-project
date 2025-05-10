namespace Elearning.Dtos
{
    public class StudentAssignmentDTO
    {
        public int StudentId { get; set; }
        public int AssignmentId { get; set; }
        public string Submission { get; set; }
        public double? Grade { get; set; }
    }
}

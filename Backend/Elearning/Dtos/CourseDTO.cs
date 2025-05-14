namespace Elearning.Dtos
{
    public class CourseDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int InstructorId { get; set; }
        public List<int> StudentIds { get; set; } = new();
        public List<int> AssignmentIds { get; set; } = new();
        public List<int> lectureIDS { get; set; } = new();



        public List<int> QuizIds { get; set; } = new();
    }
}

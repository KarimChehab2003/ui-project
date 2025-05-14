using Elearning.Models;

public class Lecture
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }

    public int CourseId { get; set; }
    public Course Course { get; set; }
}

namespace Elearning.Models
{
    // Models/Lecture.cs
    namespace Elearning.Models
    {
        public class Lecture
        {
            public int Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }

            // Foreign Key
            public int CourseId { get; set; }
            public Course Course { get; set; }
        }
    }

}

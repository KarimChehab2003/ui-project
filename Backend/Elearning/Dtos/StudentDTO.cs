﻿namespace Elearning.Dtos
{
    public class StudentDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }

        public string Password { get; set; }
        public List<int> CourseIds { get; set; } = new();
    }
}

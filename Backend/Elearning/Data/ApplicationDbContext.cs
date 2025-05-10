namespace Elearning.Data
{
    using Elearning.Models;
    using Microsoft.EntityFrameworkCore;
    using System.Collections.Generic;
    using System.Reflection.Emit;

    namespace ElearningAPI.Models
    {
        public class ElearningContext : DbContext
        {
            public ElearningContext(DbContextOptions<ElearningContext> options) : base(options) { }

            public DbSet<Student> Students { get; set; }
            public DbSet<Instructor> Instructors { get; set; }
            public DbSet<Administrator> Administrators { get; set; }
            public DbSet<Course> Courses { get; set; }
            public DbSet<Assignment> Assignments { get; set; }
            public DbSet<StudentAssignment> StudentAssignments { get; set; }

            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                // Many-to-Many: Student ⇄ Course
                modelBuilder.Entity<Course>()
                    .HasMany(c => c.StudentsEnrolled)
                    .WithMany(s => s.CoursesEnrolled)
                    .UsingEntity(j => j.ToTable("StudentCourses"));

                // Many-to-Many: Student ⇄ Assignment (Submission)
                modelBuilder.Entity<StudentAssignment>()
                    .HasKey(sa => new { sa.StudentId, sa.AssignmentId });

                modelBuilder.Entity<StudentAssignment>()
                    .HasOne(sa => sa.Student)
                    .WithMany(s => s.AssignmentsSubmitted)
                    .HasForeignKey(sa => sa.StudentId);

                modelBuilder.Entity<StudentAssignment>()
                    .HasOne(sa => sa.Assignment)
                    .WithMany(a => a.StudentAssignments)
                    .HasForeignKey(sa => sa.AssignmentId);
            }
        }
    }

}

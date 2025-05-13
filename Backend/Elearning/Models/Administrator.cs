using System.ComponentModel.DataAnnotations;

namespace Elearning.Models
{
    public class Administrator
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        public string Password { get; set; }
    }
}

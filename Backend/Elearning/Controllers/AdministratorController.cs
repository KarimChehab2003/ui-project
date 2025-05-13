using Elearning.Data.ElearningAPI.Models;
using Elearning.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Elearning.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdministratorController : ControllerBase
    {
        private readonly ElearningContext _context;

        public AdministratorController(ElearningContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdministratorDTO>>> GetAdministrator()
        {
            var admins = await _context.Administrators
                .Select(i => new AdministratorDTO
                {
                    Id = i.Id,
                    Name = i.Name,
                    Email = i.Email,
                    Password = i.Password,
                })
                .ToListAsync();

            return Ok(admins);
        }

    }
}

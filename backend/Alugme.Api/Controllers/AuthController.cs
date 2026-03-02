
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Alugme.Api.Data;
using Alugme.Api.Auth;
using Alugme.Api.Domain;

namespace Alugme.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase {
  private readonly AppDbContext _db; private readonly JwtTokenService _jwt;
  public AuthController(AppDbContext db, JwtTokenService jwt){ _db=db; _jwt=jwt; }

  public record LoginReq(string Email, string Password);

  [HttpPost("login")]
  public async Task<IActionResult> Login(LoginReq req){
    var user = await _db.Users.FirstOrDefaultAsync(x=>x.Email==req.Email);
    if(user==null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash)) 
      return Unauthorized();

    // if(user.Status != AppStatus.Active)
    //   return Forbid();

    return Ok(new 
      { 
        token=_jwt.Generate(user),
        user = new {
            user.Id,
            user.Email,
            type = user.Role.ToString().ToLower(),
            user.Name,
            user.Phone,
            user.Photo,
            user.Status,
            user.CreatedAt,
            user.LastAccess,
            user.LandlordId
        }
      });
  }
}

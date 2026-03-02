
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Alugme.Api.Domain;

namespace Alugme.Api.Auth;

public class JwtTokenService {
  private readonly IConfiguration _cfg;
  public JwtTokenService(IConfiguration cfg){ _cfg = cfg; }

  public string Generate(User user)
  {
      var claims = new List<Claim>{
          new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
          new Claim(ClaimTypes.Email, user.Email),

          new Claim(ClaimTypes.Role, user.Role.ToString())
      };

      var key = new SymmetricSecurityKey(
          Encoding.UTF8.GetBytes(_cfg["Jwt:Key"]!)
      );

      var token = new JwtSecurityToken(
          issuer: _cfg["Jwt:Issuer"],
          audience: _cfg["Jwt:Audience"],
          claims: claims,
          expires: DateTime.UtcNow.AddHours(8),
          signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
      );

      return new JwtSecurityTokenHandler().WriteToken(token);
  }
}

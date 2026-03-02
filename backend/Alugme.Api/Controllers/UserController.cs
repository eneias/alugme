
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Alugme.Api.Data;
using Alugme.Api.Auth;
using Alugme.Api.Domain;
using Microsoft.AspNetCore.Authorization;
using Alugme.Api.DTOs;

namespace Alugme.Api.Controllers;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly JwtTokenService _jwt;

    // =========================================
    // 🔄 MAPPER
    // =========================================
    private static UserDTO ToDTO(User user) => new()
    {
        Id = user.Id,
        Email = user.Email,
        Type = user.Role.ToString().ToLower(),
        Name = user.Name,
        Phone = user.Phone,
        Photo = user.Photo,
        Status = user.Role == AppRole.Admin ||
        user.Status == AppStatus.Active,
        CreatedAt = user.CreatedAt,
        LastAccess = user.LastAccess,
        LandlordId = user.LandlordId
    };

    public UserController(AppDbContext db, JwtTokenService jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    [HttpGet("last")]
    [Authorize(Roles = "Admin")]
    public async Task<IEnumerable<UserDTO>> GetLast()
    {
        return await _db.Users
            .OrderByDescending(user => user.LastAccess)
            .Take(10)
            .Select(user => new UserDTO
            {
                Id = user.Id,
                Email = user.Email,
                Type = user.Role.ToString().ToLower(),
                Name = user.Name,
                Phone = user.Phone,
                Photo = user.Photo,
                Status = user.Status == AppStatus.Active,
                CreatedAt = user.CreatedAt,
                LastAccess = user.LastAccess,
                LandlordId = user.LandlordId
            })
            .ToListAsync();
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IEnumerable<UserDTO>> Get(
        string? search,
        AppRole? role,
        AppStatus? status)
    {
        var query = _db.Users.AsQueryable();

        // 🔎 Busca por nome ou email
        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.ToLower();
            query = query.Where(u =>
                u.Name.ToLower().Contains(search) ||
                u.Email.ToLower().Contains(search));
        }

        // 🎭 Filtro por Role
        if (role.HasValue)
        {
            query = query.Where(u => u.Role == role.Value);
        }

        // ✅ Filtro por Status
        if (status.HasValue)
        {
            query = query.Where(u => u.Status == status.Value);
        }

        return await query
            .OrderByDescending(u => u.LastAccess)
            .Select(user => new UserDTO
            {
                Id = user.Id,
                Email = user.Email,
                Type = user.Role.ToString().ToLower(),
                Name = user.Name,
                Phone = user.Phone,
                Photo = user.Photo,
                Status = user.Status == AppStatus.Active,
                CreatedAt = user.CreatedAt,
                LastAccess = user.LastAccess,
                LandlordId = user.LandlordId
            })
            .ToListAsync();
    }
    
    // =========================================
    // 🔎 GET BY ID
    // =========================================
    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserDTO>> GetById(Guid id)
    {
        var user = await _db.Users.FindAsync(id);

        if (user == null)
            return NotFound();

        return ToDTO(user);
    }

    // =========================================
    // ✏ CREATE
    // =========================================
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserDTO>> Create([FromBody] CreateUserDTO dto)
    {
        if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
            return BadRequest("Email já cadastrado.");

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            Role = dto.Role,
            Status = dto.Role == AppRole.Admin
                ? AppStatus.Active
                : dto.Status,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            CreatedAt = DateTime.UtcNow,
            LastAccess = DateTime.UtcNow,
            EmailConfirmed = true,
            EmailConfirmationToken = ""
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = user.Id }, ToDTO(user));
    }

    // =========================================
    // ✏ UPDATE
    // =========================================
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserDTO>> Update(Guid id, [FromBody] UpdateUserDTO dto)
    {
        var user = await _db.Users.FindAsync(id);

        if (user == null)
            return NotFound();

        user.Name = dto.Name;
        user.Phone = dto.Phone;
        user.Photo = dto.Photo;
        user.Role = dto.Role;

        // Admin nunca pode ficar inativo
        user.Status = user.Role == AppRole.Admin
            ? AppStatus.Active
            : dto.Status;

        if (!string.IsNullOrWhiteSpace(dto.Password))
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        }

        await _db.SaveChangesAsync();

        return ToDTO(user);
    }

    // =========================================
    // ❌ DELETE
    // =========================================
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var user = await _db.Users.FindAsync(id);

        if (user == null)
            return NotFound();

        if (user.Role == AppRole.Admin)
            return BadRequest("Não é permitido remover Admin.");

        _db.Users.Remove(user);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    // =====================================================
    // 📝 REGISTRO PÚBLICO
    // =====================================================
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register(RegisterUserDTO dto)
    {
        if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
            return BadRequest("Email já cadastrado.");

        if (dto.Role.ToLower() != "locador" &&
            dto.Role.ToLower() != "locatario")
            return BadRequest("Tipo de usuário inválido.");

        var role = dto.Role.ToLower() == "locador"
            ? AppRole.Locador
            : AppRole.Locatario;

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            Role = role,
            Status = AppStatus.Pending,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            CreatedAt = DateTime.UtcNow,
            LastAccess = DateTime.UtcNow,
            EmailConfirmed = false
        };

        // Se for Locador → gerar token
        if (role == AppRole.Locador)
        {
            user.EmailConfirmationToken = Guid.NewGuid().ToString();
        }

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        // Enviar email se for Locador
        if (role == AppRole.Locador)
        {
            var confirmationLink =
                $"https://seudominio.com/confirm-email?token={user.EmailConfirmationToken}";

            // await _emailService.SendAsync(
            //     user.Email,
            //     "Confirme seu cadastro",
            //     $"Clique para confirmar sua conta: {confirmationLink}"
            // );
        }

        return Ok("Cadastro realizado com sucesso.");
    }

    // =====================================================
    // 📧 CONFIRMAÇÃO DE EMAIL (LOCADOR)
    // =====================================================
    [HttpGet("confirm-email")]
    [AllowAnonymous]
    public async Task<IActionResult> ConfirmEmail(string token)
    {
        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.EmailConfirmationToken == token);

        if (user == null)
            return BadRequest("Token inválido.");

        if (user.Role != AppRole.Locador)
            return BadRequest("Apenas locadores confirmam email.");

        user.EmailConfirmed = true;
        user.Status = AppStatus.Active;
        user.EmailConfirmationToken = null;

        await _db.SaveChangesAsync();

        return Ok("Conta confirmada com sucesso.");
    }

    // =====================================================
    // 🔓 ATIVAR LOCATÁRIO (ADMIN)
    // =====================================================
    [HttpPut("{id}/activate")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Activate(Guid id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null)
            return NotFound();

        if (user.Role != AppRole.Locatario)
            return BadRequest("Somente locatários podem ser ativados manualmente.");

        user.Status = AppStatus.Active;

        await _db.SaveChangesAsync();

        return Ok("Usuário ativado com sucesso.");
    }

}

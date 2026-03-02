using Alugme.Api.Domain;

namespace Alugme.Api.DTOs;

public class UserDTO
{
    public Guid Id { get; set; }
    public string Email { get; set; } = null!;
    public string Type { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? Phone { get; set; }
    public string? Photo { get; set; }
    public bool Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastAccess { get; set; }
    public Guid? LandlordId { get; set; }
}

public class UpdateUserDTO
{
    public string Name { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string? Photo { get; set; }
    public AppRole Role { get; set; }
    public AppStatus Status { get; set; }
    public string? Password { get; set; }
}

public class CreateUserDTO
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string? Photo { get; set; }
    public AppRole Role { get; set; }
    public AppStatus Status { get; set; }
    public string Password { get; set; } = null!;
}

public class RegisterUserDTO
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Role { get; set; } = null!; // "locador" ou "locatario"
}
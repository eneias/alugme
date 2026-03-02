using System.ComponentModel.DataAnnotations.Schema;

namespace Alugme.Api.Domain;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public AppStatus Status { get; set; } = AppStatus.Pending;
    public AppRole Role { get; set; }
    public string? Phone { get; set; }
    public string? Photo { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastAccess { get; set; } = DateTime.UtcNow;
    public Guid? LandlordId { get; set; }
    public Landlord? Landlord { get; set; }
    public bool EmailConfirmed { get; internal set; }
    public string EmailConfirmationToken { get; internal set; }
}

public class Property
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public required string Name { get; set; }
    public string Address { get; set; } = "";
    public string Neighborhood { get; set; } = "";
    public string City { get; set; } = "";

    public decimal Price { get; set; }
    public int Bedrooms { get; set; }
    public int Bathrooms { get; set; }
    public decimal Area { get; set; }

    public decimal Rating { get; set; }
    public int Reviews { get; set; }
    public DateTime CreatedAt { get; set; }

    public string Description { get; set; } = "";

    public List<string> Amenities { get; set; } = new();
    public List<string> Images { get; set; } = new();

    public decimal Lat { get; set; }
    public decimal Lng { get; set; }

    public Guid? LandlordId { get; set; }
    public Guid? BankAccountId { get; set; }

    public Landlord? Landlord { get; set; }
    public BankAccount? BankAccount { get; set; }

    public string Availability { get; set; } = "";
}

public class Landlord
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<Property> Properties { get; set; } = new List<Property>();
    public ICollection<BankAccount> BankAccounts { get; set; } = new List<BankAccount>();
    public ICollection<Rental> Rentals { get; set; } = new List<Rental>();
    public ICollection<RentalContract> Contracts { get; set; } = new List<RentalContract>();
}

public class BankAccount
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid LandlordId { get; set; }

    public string Bank { get; set; } = null!;
    public string Agency { get; set; } = null!;
    public string Account { get; set; } = null!;
    public BankAccountType AccountType { get; set; }

    public string HolderName { get; set; } = null!;
    public string HolderCpf { get; set; } = null!;
    public bool Validated { get; set; }

    public Landlord Landlord { get; set; } = null!;
}

public class Rental
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid PropertyId { get; set; }
    public Guid TenantId { get; set; }
    public Guid LandlordId { get; set; }
    public Guid? BankAccountId { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public ContractStatus Status { get; set; } = ContractStatus.Active;

    public Property Property { get; set; } = null!;
    public User Tenant { get; set; } = null!;
    public Landlord Landlord { get; set; } = null!;
    public BankAccount? BankAccount { get; set; }
}

public class RentalContract
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid RentalId { get; set; }
    public Guid PropertyId { get; set; }
    public Guid? TenantId { get; set; }
    public Guid LandlordId { get; set; }

    public decimal MonthlyRent { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int Duration { get; set; }
    public ContractStatus Status { get; set; } = ContractStatus.Active;

    public Rental Rental { get; set; } = null!;
    public Property Property { get; set; } = null!;
    public User? Tenant { get; set; }
    public Landlord Landlord { get; set; } = null!;
}

public class Inspection
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid PropertyId { get; set; }

    public InspectionType Type { get; set; }
    public InspectionStatus Status { get; set; } = InspectionStatus.PendingTenant;

    public bool Locked { get; set; }
    public string? Observations { get; set; }

    public ICollection<InspectionPhoto> Photos { get; set; } = new List<InspectionPhoto>();
    public Property Property { get; set; } = null!;
}

public class InspectionPhoto
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid InspectionId { get; set; }

    public string Url { get; set; } = null!;
    public string? Description { get; set; }

    public UploadedByType UploadedBy { get; set; }

    public Inspection Inspection { get; set; } = null!;
}

public class Banner
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Title { get; set; } = null!;
    public string Subtitle { get; set; } = null!;
    public string ImageUrl { get; set; } = null!;
    public string LinkUrl { get; set; } = null!;

    public bool Active { get; set; } = true;
    public int Order { get; set; }
}

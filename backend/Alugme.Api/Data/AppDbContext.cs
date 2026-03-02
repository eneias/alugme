using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Alugme.Api.Domain;

namespace Alugme.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Property> Properties => Set<Property>();
    public DbSet<Landlord> Landlords => Set<Landlord>();
    public DbSet<BankAccount> BankAccounts => Set<BankAccount>();
    public DbSet<Rental> Rentals => Set<Rental>();
    public DbSet<RentalContract> RentalContracts => Set<RentalContract>();
    public DbSet<Inspection> Inspections => Set<Inspection>();
    public DbSet<InspectionPhoto> InspectionPhotos => Set<InspectionPhoto>();
    public DbSet<Banner> Banners => Set<Banner>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        var stringListComparer = new ValueComparer<List<string>>(
            (c1, c2) => c1!.SequenceEqual(c2!),
            c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
            c => c.ToList()
        );

        builder.Entity<User>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.HasOne(x => x.Landlord)
                .WithMany(l => l.Users)
                .HasForeignKey(x => x.LandlordId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<Property>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Price).HasPrecision(18, 2);
            entity.Property(x => x.Area).HasPrecision(10, 2);
            entity.Property(x => x.Rating).HasPrecision(3, 2);
            entity.Property(x => x.Lat).HasPrecision(9, 6);
            entity.Property(x => x.Lng).HasPrecision(9, 6);

            entity.Property(x => x.Amenities)
                .HasConversion(
                    v => string.Join(";", v),
                    v => v.Split(";", StringSplitOptions.RemoveEmptyEntries).ToList()
                )
                .Metadata.SetValueComparer(stringListComparer);

            entity.Property(x => x.Images)
                .HasConversion(
                    v => string.Join(";", v),
                    v => v.Split(";", StringSplitOptions.RemoveEmptyEntries).ToList()
                )
                .Metadata.SetValueComparer(stringListComparer);

            entity.HasOne(x => x.Landlord)
                .WithMany(l => l.Properties)
                .HasForeignKey(x => x.LandlordId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.BankAccount)
                .WithMany()
                .HasForeignKey(x => x.BankAccountId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<RentalContract>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.MonthlyRent).HasPrecision(18, 2);
            entity.Property(x => x.Status).HasConversion<int>();

            entity.HasOne(x => x.Rental)
                .WithMany()
                .HasForeignKey(x => x.RentalId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.Property)
                .WithMany()
                .HasForeignKey(x => x.PropertyId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.Tenant)
                .WithMany()
                .HasForeignKey(x => x.TenantId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.Landlord)
                .WithMany(l => l.Contracts)
                .HasForeignKey(x => x.LandlordId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<Landlord>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.HasMany(x => x.Users)
                .WithOne(u => u.Landlord)
                .HasForeignKey(u => u.LandlordId)
                .OnDelete(DeleteBehavior.Restrict);
        });
            
        builder.Entity<Rental>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Status)
                    .HasConversion<int>();

            entity.HasOne(x => x.Property)
                    .WithMany()
                    .HasForeignKey(x => x.PropertyId)
                    .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.Tenant)
                    .WithMany()
                    .HasForeignKey(x => x.TenantId)
                    .OnDelete(DeleteBehavior.Restrict); 

            entity.HasOne(x => x.Landlord)
                    .WithMany(l => l.Rentals)
                    .HasForeignKey(x => x.LandlordId)
                    .OnDelete(DeleteBehavior.Restrict); 

            entity.HasOne(x => x.BankAccount)
                    .WithMany()
                    .HasForeignKey(x => x.BankAccountId)
                    .OnDelete(DeleteBehavior.Restrict);
        });
    
        builder.Entity<BankAccount>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.HasOne(x => x.Landlord)
                .WithMany(l => l.BankAccounts)
                .HasForeignKey(x => x.LandlordId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}

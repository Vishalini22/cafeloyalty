using CafeLoyalty.Domain.Enums;

namespace CafeLoyalty.Domain.Entities;

public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public DateTime JoinDate { get; set; } = DateTime.UtcNow;
    public int PointsBalance { get; set; } = 0;
    public Tier Tier { get; set; } = Tier.Regular;
    public Role Role { get; set; } = Role.Customer;

    public int LifetimePoints { get; set; } = 0;
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    public ICollection<Redemption> Redemptions { get; set; } = new List<Redemption>();
}
namespace CafeLoyalty.Domain.Entities;

public class Redemption
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;
    public int RewardId { get; set; }
    public Reward Reward { get; set; } = null!;
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public int PointsSpent { get; set; }
}
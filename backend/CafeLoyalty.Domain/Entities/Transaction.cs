namespace CafeLoyalty.Domain.Entities;

public class Transaction
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;
    public decimal Amount { get; set; }
    public int PointsEarned { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string? Notes { get; set; }
}
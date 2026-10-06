namespace CafeLoyalty.Domain.Entities;

public class Reward
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int PointsCost { get; set; }
    public bool IsActive { get; set; } = true;
}
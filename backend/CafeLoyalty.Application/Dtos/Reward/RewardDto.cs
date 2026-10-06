namespace Application.Dtos.Reward
{
    public class RewardDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int PointsCost { get; set; }
        public bool IsActive { get; set; }
    }
}
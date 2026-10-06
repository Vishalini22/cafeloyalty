namespace Application.Dtos.Reward
{
    public class CreateRewardDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int PointsCost { get; set; }
    }
}
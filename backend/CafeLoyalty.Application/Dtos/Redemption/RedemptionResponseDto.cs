namespace Application.Dtos.Redemption
{
    public class RedemptionResponseDto
    {
        public int RedemptionId { get; set; }
        public string RewardName { get; set; } = string.Empty;
        public int PointsSpent { get; set; }
        public int RemainingPointsBalance { get; set; }
    }
}
namespace Application.Dtos.Transaction
{
    public class TransactionResponseDto
    {
        public int TransactionId { get; set; }
        public decimal Amount { get; set; }
        public int PointsEarned { get; set; }
        public int NewPointsBalance { get; set; }
        public int NewLifetimePoints { get; set; }
        public string Tier { get; set; } = string.Empty;
        public bool TierChanged { get; set; }
    }
}
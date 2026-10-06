namespace Application.Dtos.Transaction
{
    public class CreateTransactionRequestDto
    {
        public int CustomerId { get; set; }
        public decimal Amount { get; set; }
        public string? Notes { get; set; }
    }
}
using CafeLoyalty.Domain.Entities;

namespace CafeLoyalty.Application.Interfaces;

public class TransactionResult
{
    public required Transaction Transaction { get; init; }
    public required Customer Customer { get; init; }
    public required bool TierChanged { get; init; }
}

public interface ITransactionService
{
    Task<TransactionResult> RecordTransactionAsync(int customerId, decimal amount, string? notes);
    Task<IReadOnlyList<Transaction>> GetCustomerTransactionsAsync(int customerId);
}
using CafeLoyalty.Application.Interfaces;
using CafeLoyalty.Domain.Entities;
using CafeLoyalty.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CafeLoyalty.Infrastructure.Services;

public class TransactionService : ITransactionService
{
    private readonly CafeLoyaltyDbContext _context;
    private readonly ITierService _tierService;

    public TransactionService(CafeLoyaltyDbContext context, ITierService tierService)
    {
        _context = context;
        _tierService = tierService;
    }

    public async Task<TransactionResult> RecordTransactionAsync(int customerId, decimal amount, string? notes)
    {
        if (amount <= 0)
            throw new ArgumentException("Amount must be greater than zero.");

        var customer = await _context.Customers.FindAsync(customerId)
            ?? throw new KeyNotFoundException("Customer not found.");

        var pointsEarned = _tierService.CalculatePointsEarned(amount);
        var previousTier = customer.Tier;

        var transaction = new Transaction
        {
            CustomerId = customer.Id,
            Amount = amount,
            PointsEarned = pointsEarned,
            Notes = notes
        };

        customer.PointsBalance += pointsEarned;
        customer.LifetimePoints += pointsEarned;
        customer.Tier = _tierService.CalculateTier(customer.LifetimePoints);

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return new TransactionResult
        {
            Transaction = transaction,
            Customer = customer,
            TierChanged = previousTier != customer.Tier
        };
    }

    public async Task<IReadOnlyList<Transaction>> GetCustomerTransactionsAsync(int customerId)
    {
        var customerExists = await _context.Customers.AnyAsync(c => c.Id == customerId);
        if (!customerExists)
            throw new KeyNotFoundException("Customer not found.");

        return await _context.Transactions
            .Where(t => t.CustomerId == customerId)
            .OrderByDescending(t => t.Date)
            .ToListAsync();
    }
}
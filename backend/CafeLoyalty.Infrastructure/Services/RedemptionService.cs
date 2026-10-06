using CafeLoyalty.Application.Interfaces;
using CafeLoyalty.Domain.Entities;
using CafeLoyalty.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CafeLoyalty.Infrastructure.Services;

public class RedemptionService : IRedemptionService
{
    private readonly CafeLoyaltyDbContext _context;

    public RedemptionService(CafeLoyaltyDbContext context)
    {
        _context = context;
    }

    public async Task<RedemptionResult> RedeemAsync(int customerId, int rewardId)
    {
        var customer = await _context.Customers.FindAsync(customerId)
            ?? throw new KeyNotFoundException("Customer not found.");

        var reward = await _context.Rewards.FindAsync(rewardId)
            ?? throw new KeyNotFoundException("Reward not found.");

        if (!reward.IsActive)
            throw new ArgumentException("This reward is no longer available.");

        if (customer.PointsBalance < reward.PointsCost)
            throw new ArgumentException("Insufficient points balance for this reward.");

        customer.PointsBalance -= reward.PointsCost;

        var redemption = new Redemption
        {
            CustomerId = customer.Id,
            RewardId = reward.Id,
            PointsSpent = reward.PointsCost
        };

        _context.Redemptions.Add(redemption);
        await _context.SaveChangesAsync();

        return new RedemptionResult
        {
            Redemption = redemption,
            Reward = reward,
            RemainingPointsBalance = customer.PointsBalance
        };
    }

    public async Task<IReadOnlyList<Redemption>> GetCustomerRedemptionsAsync(int customerId)
    {
        return await _context.Redemptions
            .Include(r => r.Reward)
            .Where(r => r.CustomerId == customerId)
            .OrderByDescending(r => r.Date)
            .ToListAsync();
    }
}
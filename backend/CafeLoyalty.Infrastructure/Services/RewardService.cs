using CafeLoyalty.Application.Interfaces;
using CafeLoyalty.Domain.Entities;
using CafeLoyalty.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CafeLoyalty.Infrastructure.Services;

public class RewardService : IRewardService
{
    private readonly CafeLoyaltyDbContext _context;

    public RewardService(CafeLoyaltyDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Reward>> GetActiveRewardsAsync()
    {
        return await _context.Rewards
            .Where(r => r.IsActive)
            .OrderBy(r => r.PointsCost)
            .ToListAsync();
    }

    public async Task<Reward> CreateRewardAsync(string name, string? description, int pointsCost)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Reward name is required.");

        if (pointsCost <= 0)
            throw new ArgumentException("Points cost must be greater than zero.");

        var reward = new Reward
        {
            Name = name,
            Description = description,
            PointsCost = pointsCost,
            IsActive = true
        };

        _context.Rewards.Add(reward);
        await _context.SaveChangesAsync();

        return reward;
    }

    public async Task<List<Reward>> GetAllAsync()
    {
        return await _context.Rewards
            .OrderByDescending(r => r.Id)
            .Take(10)
            .ToListAsync();
    }
}
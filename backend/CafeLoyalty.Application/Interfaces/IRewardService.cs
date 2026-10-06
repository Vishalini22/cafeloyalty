using CafeLoyalty.Domain.Entities;

namespace CafeLoyalty.Application.Interfaces;

public interface IRewardService
{
    Task<IReadOnlyList<Reward>> GetActiveRewardsAsync();
    Task<Reward> CreateRewardAsync(string name, string? description, int pointsCost);
    Task<List<Reward>> GetAllAsync();
}
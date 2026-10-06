using CafeLoyalty.Domain.Entities;

namespace CafeLoyalty.Application.Interfaces;

public class RedemptionResult
{
    public required Redemption Redemption { get; init; }
    public required Reward Reward { get; init; }
    public required int RemainingPointsBalance { get; init; }
}

public interface IRedemptionService
{
    Task<RedemptionResult> RedeemAsync(int customerId, int rewardId);
    Task<IReadOnlyList<Redemption>> GetCustomerRedemptionsAsync(int customerId);
}
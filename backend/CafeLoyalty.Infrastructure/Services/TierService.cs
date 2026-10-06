using CafeLoyalty.Application.Interfaces;
using CafeLoyalty.Domain.Enums;

namespace CafeLoyalty.Infrastructure.Services;

public class TierService : ITierService
{
    private const int CoffeeEnthusiastThreshold = 500;
    private const int CoffeeConnoisseurThreshold = 1500;
    private const decimal PointsPerLkr = 100m; // 1 point per 100 LKR spent

    public Tier CalculateTier(int lifetimePoints)
    {
        if (lifetimePoints >= CoffeeConnoisseurThreshold)
            return Tier.CoffeeConnoisseur;

        if (lifetimePoints >= CoffeeEnthusiastThreshold)
            return Tier.CoffeeEnthusiast;

        return Tier.Regular;
    }

    public int CalculatePointsEarned(decimal amountSpent)
    {
        if (amountSpent <= 0)
            return 0;

        return (int)Math.Floor(amountSpent / PointsPerLkr);
    }
}
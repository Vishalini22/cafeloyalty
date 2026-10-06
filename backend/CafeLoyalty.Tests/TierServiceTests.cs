using CafeLoyalty.Infrastructure.Services;
using CafeLoyalty.Domain.Enums;
using Xunit;

namespace CafeLoyalty.Tests;

public class TierServiceTests
{
    private readonly TierService _tierService = new();

    [Theory]
    [InlineData(0, Tier.Regular)]
    [InlineData(499, Tier.Regular)]
    [InlineData(500, Tier.CoffeeEnthusiast)]
    [InlineData(1499, Tier.CoffeeEnthusiast)]
    [InlineData(1500, Tier.CoffeeConnoisseur)]
    [InlineData(5000, Tier.CoffeeConnoisseur)]
    public void CalculateTier_ReturnsExpectedTier(int lifetimePoints, Tier expectedTier)
    {
        var result = _tierService.CalculateTier(lifetimePoints);
        Assert.Equal(expectedTier, result);
    }

    [Theory]
    [InlineData(0, 0)]
    [InlineData(50, 0)]
    [InlineData(100, 1)]
    [InlineData(850, 8)]
    [InlineData(1000, 10)]
    public void CalculatePointsEarned_ReturnsExpectedPoints(decimal amountSpent, int expectedPoints)
    {
        var result = _tierService.CalculatePointsEarned(amountSpent);
        Assert.Equal(expectedPoints, result);
    }

    [Fact]
    public void CalculatePointsEarned_NegativeAmount_ReturnsZero()
    {
        var result = _tierService.CalculatePointsEarned(-100);
        Assert.Equal(0, result);
    }
}
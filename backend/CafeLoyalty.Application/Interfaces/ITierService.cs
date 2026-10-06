using CafeLoyalty.Domain.Enums;

namespace CafeLoyalty.Application.Interfaces;

public interface ITierService
{
    Tier CalculateTier(int lifetimePoints);
    int CalculatePointsEarned(decimal amountSpent);
}
using Application.Dtos.Redemption;
using CafeLoyalty.Application.Interfaces;
using CafeLoyalty.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CafeLoyalty.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RedemptionController : ControllerBase
{
    private readonly IRedemptionService _redemptionService;

    public RedemptionController(IRedemptionService redemptionService)
    {
        _redemptionService = redemptionService;
    }

    [HttpPost]
    [ProducesResponseType(typeof(RedemptionResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<RedemptionResponseDto> Redeem(CreateRedemptionDto request)
    {
        var result = await _redemptionService.RedeemAsync(request.CustomerId, request.RewardId);

        return new RedemptionResponseDto
        {
            RedemptionId = result.Redemption.Id,
            RewardName = result.Reward.Name,
            PointsSpent = result.Redemption.PointsSpent,
            RemainingPointsBalance = result.RemainingPointsBalance
        };
    }

    [HttpGet("customer/{customerId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IReadOnlyList<Redemption>> GetCustomerRedemptions(int customerId)
    {
        return await _redemptionService.GetCustomerRedemptionsAsync(customerId);
    }
}
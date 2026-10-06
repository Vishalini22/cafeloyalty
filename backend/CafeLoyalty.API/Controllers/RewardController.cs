using Application.Dtos.Reward;
using CafeLoyalty.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CafeLoyalty.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RewardController : ControllerBase
{
    private readonly IRewardService _rewardService;

    public RewardController(IRewardService rewardService)
    {
        _rewardService = rewardService;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IReadOnlyList<RewardDto>> GetActiveRewards()
    {
        var rewards = await _rewardService.GetActiveRewardsAsync();

        return rewards.Select(r => new RewardDto
        {
            Id = r.Id,
            Name = r.Name,
            Description = r.Description,
            PointsCost = r.PointsCost
        }).ToList();
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<RewardDto> CreateReward(CreateRewardDto request)
    {
        var reward = await _rewardService.CreateRewardAsync(request.Name, request.Description, request.PointsCost);

        return new RewardDto
        {
            Id = reward.Id,
            Name = reward.Name,
            Description = reward.Description,
            PointsCost = reward.PointsCost
        };
    }

    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<RewardDto>>> GetAll()
    {
        var rewards = await _rewardService.GetAllAsync();
        var dtos = rewards.Select(r => new RewardDto
        {
            Id = r.Id,
            Name = r.Name,
            Description = r.Description,
            PointsCost = r.PointsCost,
            IsActive = r.IsActive
        }).ToList();

        return Ok(dtos);
    }
}
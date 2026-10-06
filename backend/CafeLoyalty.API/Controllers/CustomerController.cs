using System.Security.Claims;
using Application.Dtos.Customer;
using CafeLoyalty.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CafeLoyalty.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CustomerController : ControllerBase
{
    private readonly ICustomerService _customerService;

    public CustomerController(ICustomerService customerService)
    {
        _customerService = customerService;
    }

    [HttpGet("me")]
    [ProducesResponseType(typeof(CustomerProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<CustomerProfileDto> GetMyProfile()
    {
        var customerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub")
            ?? throw new UnauthorizedAccessException("Invalid token."));

        var customer = await _customerService.GetByIdAsync(customerId);

        return new CustomerProfileDto
        {
            Id = customer.Id,
            Name = customer.Name,
            Email = customer.Email,
            Phone = customer.Phone,
            PointsBalance = customer.PointsBalance,
            LifetimePoints = customer.LifetimePoints,
            Tier = customer.Tier.ToString(),
            Role = customer.Role.ToString(),
            JoinDate = customer.JoinDate
        };


    }

    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(List<CustomerProfileDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<List<CustomerProfileDto>> GetAllCustomers()
    {
        var customers = await _customerService.GetAllAsync();

        return customers.Select(c => new CustomerProfileDto
        {
            Id = c.Id,
            Name = c.Name,
            Email = c.Email,
            Phone = c.Phone,
            PointsBalance = c.PointsBalance,
            LifetimePoints = c.LifetimePoints,
            Tier = c.Tier.ToString(),
            Role = c.Role.ToString(),
            JoinDate = c.JoinDate
        }).ToList();
    }
}
using CafeLoyalty.Application.Interfaces;
using CafeLoyalty.Domain.Entities;
using CafeLoyalty.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CafeLoyalty.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly CafeLoyaltyDbContext _context;
    private readonly ITokenService _tokenService;

    public AuthController(CafeLoyaltyDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    public record RegisterRequest(string Name, string Email, string Password, string? Phone);
    public record LoginRequest(string Email, string Password);
    public record AuthResponse(string Token, string Name, string Email, string Role);

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        if (await _context.Customers.AnyAsync(c => c.Email == request.Email))
        {
            return Conflict("A customer with this email already exists.");
        }

        var customer = new Customer
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Phone = request.Phone
        };

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();

        var token = _tokenService.GenerateToken(customer);

        return Ok(new AuthResponse(token, customer.Name, customer.Email, customer.Role.ToString()));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == request.Email);

        if (customer is null || !BCrypt.Net.BCrypt.Verify(request.Password, customer.PasswordHash))
        {
            return Unauthorized("Invalid email or password.");
        }

        var token = _tokenService.GenerateToken(customer);

        return Ok(new AuthResponse(token, customer.Name, customer.Email, customer.Role.ToString()));
    }
}
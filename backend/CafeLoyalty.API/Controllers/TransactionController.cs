using Application.Dtos.Transaction;
using CafeLoyalty.Application.Interfaces;
using CafeLoyalty.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CafeLoyalty.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TransactionController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(TransactionResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<TransactionResponseDto> CreateTransaction(CreateTransactionRequestDto request)
    {
        var result = await _transactionService.RecordTransactionAsync(request.CustomerId, request.Amount, request.Notes);

        return new TransactionResponseDto
        {
            TransactionId = result.Transaction.Id,
            Amount = result.Transaction.Amount,
            PointsEarned = result.Transaction.PointsEarned,
            NewPointsBalance = result.Customer.PointsBalance,
            NewLifetimePoints = result.Customer.LifetimePoints,
            Tier = result.Customer.Tier.ToString(),
            TierChanged = result.TierChanged
        };
    }

    [HttpGet("customer/{customerId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IReadOnlyList<Transaction>> GetCustomerTransactions(int customerId)
    {
        return await _transactionService.GetCustomerTransactionsAsync(customerId);
    }
}
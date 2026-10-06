using CafeLoyalty.Application.Interfaces;
using CafeLoyalty.Domain.Entities;
using CafeLoyalty.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CafeLoyalty.Infrastructure.Services;

public class CustomerService : ICustomerService
{
    private readonly CafeLoyaltyDbContext _context;

    public CustomerService(CafeLoyaltyDbContext context)
    {
        _context = context;
    }

    public async Task<Customer> GetByIdAsync(int customerId)
    {
        return await _context.Customers.FindAsync(customerId)
            ?? throw new KeyNotFoundException("Customer not found.");
    }

    public async Task<List<Customer>> GetAllAsync()
    {
        return await _context.Customers.ToListAsync();
    }
}
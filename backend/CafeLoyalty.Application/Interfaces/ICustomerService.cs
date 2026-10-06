using CafeLoyalty.Domain.Entities;

namespace CafeLoyalty.Application.Interfaces;

public interface ICustomerService
{
    Task<Customer> GetByIdAsync(int customerId);
    Task<List<Customer>> GetAllAsync();
}
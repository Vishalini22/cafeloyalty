using CafeLoyalty.Domain.Entities;

namespace CafeLoyalty.Application.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(Customer customer);
    }
}
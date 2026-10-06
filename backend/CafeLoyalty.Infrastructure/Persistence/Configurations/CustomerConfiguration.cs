using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CafeLoyalty.Domain.Entities;

namespace CafeLoyalty.Infrastructure.Persistence.Configurations
{
    public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
    {
        public void Configure(EntityTypeBuilder<Customer> builder)
        {
            builder.Property(c => c.Name) .HasMaxLength(100);
            builder.Property(c => c.Email) .HasMaxLength(150);
            builder.Property(c => c.PasswordHash).HasMaxLength(255);
            builder.Property(c => c.Phone) .HasMaxLength(20);
        }
    }
}
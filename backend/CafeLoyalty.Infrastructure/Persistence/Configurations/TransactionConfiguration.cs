using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CafeLoyalty.Domain.Entities;

namespace CafeLoyalty.Infrastructure.Persistence.Configurations
{
    public class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
    {
        public void Configure(EntityTypeBuilder<Transaction> builder)
        {
            builder.Property(t => t.Amount) .HasColumnType("decimal(10,2)");
            builder.Property(t => t.Notes) .HasMaxLength(255);
        }
    }
}
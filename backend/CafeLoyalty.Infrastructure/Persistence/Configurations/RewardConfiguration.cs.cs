using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CafeLoyalty.Domain.Entities;

namespace CafeLoyalty.Infrastructure.Persistence.Configurations
{
    public class RewardConfiguration : IEntityTypeConfiguration<Reward>
    {
        public void Configure(EntityTypeBuilder<Reward> builder)
        {
            builder.Property(r => r.Name)  .HasMaxLength(100);
            builder.Property(r => r.Description).HasMaxLength(255);
        }
    }
}
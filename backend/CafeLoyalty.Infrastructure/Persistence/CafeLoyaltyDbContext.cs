using Microsoft.EntityFrameworkCore;
using CafeLoyalty.Domain.Entities;

namespace CafeLoyalty.Infrastructure.Persistence
{
    public class CafeLoyaltyDbContext : DbContext
    {
        public CafeLoyaltyDbContext(DbContextOptions<CafeLoyaltyDbContext> options)
            : base(options)
        {
        }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Reward> Rewards { get; set; }
        public DbSet<Redemption> Redemptions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(CafeLoyaltyDbContext).Assembly);
            base.OnModelCreating(modelBuilder);
        }
    }
}
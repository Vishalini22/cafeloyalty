namespace Application.Dtos.Customer
{
    public class CustomerProfileDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public int PointsBalance { get; set; }
        public int LifetimePoints { get; set; }
        public string Tier { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTime JoinDate { get; set; }
    }
}
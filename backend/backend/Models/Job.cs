using System;

namespace backend.Models
{
    public class Job
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Designation { get; set; }
        public string? State { get; set; }
        public string? District { get; set; }
        public string? Address { get; set; }
        public string? Skills { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

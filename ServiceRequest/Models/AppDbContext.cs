using Microsoft.EntityFrameworkCore;

namespace ServiceRequest.Models
{
    public class AppDbContext : DbContext

    {

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<ServiceRequest> ServiceRequests { get; set; }
        public DbSet<Attachment> Attachments { get; set; }
    }
}

using ChatApp.Models;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Database
{
    public class ChatAppContext : DbContext
    {
        public DbSet<Message> Messages { get; set; }

        public ChatAppContext() : base() { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Server=localhost;Port=5432;Database=chatappdb;User Id=postgres;Password=postgre@AntonioPotra12");
        }
    }
}

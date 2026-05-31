using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): base(options){}

    // Tables
    public DbSet<TodoItem> TodoItems { get; set; }

    public DbSet<Category> Categories { get; set; }

    public DbSet<Priority> Priorities { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Table Names
        modelBuilder.Entity<TodoItem>().ToTable("todo_details");
        modelBuilder.Entity<Category>().ToTable("categories");
        modelBuilder.Entity<Priority>().ToTable("priorities");

        // Snake Case Column Mapping - TodoItem
        modelBuilder.Entity<TodoItem>(entity =>
        {
            entity.Property(t => t.Id).HasColumnName("id");

            entity.Property(t => t.Title).HasColumnName("title");

            entity.Property(t => t.Description).HasColumnName("description");

            entity.Property(t => t.IsCompleted)
                .HasColumnName("is_completed");

            entity.Property(t => t.CategoryId)
                .HasColumnName("category_id");

            entity.Property(t => t.PriorityId)
                .HasColumnName("priority_id");

            entity.Property(t => t.CreatedAt)
                .HasColumnName("created_at");

            entity.Property(t => t.UpdatedAt)
                .HasColumnName("updated_at");
        });

        // Snake Case Column Mapping - Category
        modelBuilder.Entity<Category>(entity =>
        {
            entity.Property(c => c.Id).HasColumnName("id");

            entity.Property(c => c.Name)
                .HasColumnName("name");

            entity.Property(c => c.CreatedAt)
                .HasColumnName("created_at");
        });

        // Snake Case Column Mapping - Priority
        modelBuilder.Entity<Priority>(entity =>
        {
            entity.Property(p => p.Id).HasColumnName("id");

            entity.Property(p => p.Name)
                .HasColumnName("name");

            entity.Property(p => p.CreatedAt)
                .HasColumnName("created_at");
        });

        // Relationships
        modelBuilder.Entity<TodoItem>()
            .HasOne(t => t.Category)
            .WithMany(c => c.TodoItems)
            .HasForeignKey(t => t.CategoryId);

        modelBuilder.Entity<TodoItem>()
            .HasOne(t => t.Priority)
            .WithMany(p => p.TodoItems)
            .HasForeignKey(t => t.PriorityId);
    }
}
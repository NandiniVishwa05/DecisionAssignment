namespace backend.Models;

public class TodoItem
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public bool IsCompleted { get; set; } = false;

    // Foreign Keys
    public int CategoryId { get; set; }

    public int PriorityId { get; set; }

    // Navigation Properties
    public Category Category { get; set; } = null!;

    public Priority Priority { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
namespace backend.Models;

public class Priority
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // One priority -> many todos
    public List<TodoItem> TodoItems { get; set; } = new();
}
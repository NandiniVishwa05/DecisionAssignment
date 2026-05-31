namespace backend.DTOs;

public class TodoResponseDto
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }

    public int CategoryId { get; set; }
    public required string CategoryName { get; set; }
    public CategoryDto? Category { get; set; }

    public int PriorityId { get; set; }
    public required string PriorityName { get; set; }
    public PriorityDto? Priority { get; set; }

    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
}
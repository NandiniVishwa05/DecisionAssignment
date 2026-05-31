namespace backend.DTOs;

public class TodoCreateDto
{
    public required string  Title { get; set; }
    public string? Description { get; set; }

    public int CategoryId { get; set; }   // FK
    public int PriorityId { get; set; }   // FK
}
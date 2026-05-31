public class TodoUpdateDto
{
    public required string Title { get; set; }
    public string? Description { get; set; }

    public int CategoryId { get; set; }
    public int PriorityId { get; set; }
    public bool IsCompleted { get; set; }
}
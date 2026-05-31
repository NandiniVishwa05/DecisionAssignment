namespace backend.DTOs;

public class PaginatedTodosResponseDto
{
    public required List<TodoResponseDto> Data { get; set; }
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

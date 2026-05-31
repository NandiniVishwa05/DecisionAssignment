using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class TodoService
{
    private readonly ApplicationDbContext _context;

    public TodoService(ApplicationDbContext context)
    {
        _context = context;
    }

    // =====================================================
    // 1. GET TODOS (PAGINATION)
    // =====================================================
    public async Task<PaginatedTodosResponseDto> GetPaged(int page, int pageSize)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 6;

        var query = _context.TodoItems
            .Include(t => t.Category)
            .Include(t => t.Priority)
            .AsNoTracking();

        var totalCount = await query.CountAsync();

        var todos = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new TodoResponseDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,

                CategoryId = t.CategoryId,
                CategoryName = t.Category.Name,
                Category = new CategoryDto { Id = t.Category.Id, Name = t.Category.Name },

                PriorityId = t.PriorityId,
                PriorityName = t.Priority.Name,
                Priority = new PriorityDto { Id = t.Priority.Id, Name = t.Priority.Name },

                IsCompleted = t.IsCompleted,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync();

        var totalPages = (totalCount + pageSize - 1) / pageSize;

        return new PaginatedTodosResponseDto
        {
            Data = todos,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = totalPages
        };
    }

    // =====================================================
    // 2. CREATE TODO
    // =====================================================
    public async Task<TodoResponseDto> Create(TodoCreateDto dto)
    {
        var todo = new TodoItem
        {
            Title = dto.Title,
            Description = dto.Description,
            CategoryId = dto.CategoryId,
            PriorityId = dto.PriorityId,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.TodoItems.Add(todo);
        await _context.SaveChangesAsync();

        var created = await _context.TodoItems
            .Include(t => t.Category)
            .Include(t => t.Priority)
            .FirstAsync(t => t.Id == todo.Id);

        return new TodoResponseDto
        {
            Id = created.Id,
            Title = created.Title,
            Description = created.Description,

            CategoryId = created.CategoryId,
            CategoryName = created.Category.Name,
            Category = new CategoryDto { Id = created.Category.Id, Name = created.Category.Name },

            PriorityId = created.PriorityId,
            PriorityName = created.Priority.Name,
            Priority = new PriorityDto { Id = created.Priority.Id, Name = created.Priority.Name },

            IsCompleted = created.IsCompleted,
            CreatedAt = created.CreatedAt
        };
    }

    // =====================================================
    // 3. GET BY ID
    // =====================================================
    public async Task<TodoResponseDto?> GetById(int id)
    {
        return await _context.TodoItems
            .Include(t => t.Category)
            .Include(t => t.Priority)
            .Where(t => t.Id == id)
            .Select(t => new TodoResponseDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,

                CategoryId = t.CategoryId,
                CategoryName = t.Category.Name,
                Category = new CategoryDto { Id = t.Category.Id, Name = t.Category.Name },

                PriorityId = t.PriorityId,
                PriorityName = t.Priority.Name,
                Priority = new PriorityDto { Id = t.Priority.Id, Name = t.Priority.Name },

                IsCompleted = t.IsCompleted,
                CreatedAt = t.CreatedAt
            })
            .FirstOrDefaultAsync();
    }

    // =====================================================
    // 4. UPDATE TODO
    // =====================================================
    public async Task<TodoResponseDto?> Update(int id, TodoUpdateDto dto)
    {
        var todo = await _context.TodoItems.FindAsync(id);

        if (todo == null)
            return null;

        todo.Title = dto.Title;
        todo.Description = dto.Description;
        todo.CategoryId = dto.CategoryId;
        todo.PriorityId = dto.PriorityId;
        todo.IsCompleted = dto.IsCompleted;
        todo.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var updated = await _context.TodoItems
            .Include(t => t.Category)
            .Include(t => t.Priority)
            .FirstAsync(t => t.Id == id);

        return new TodoResponseDto
        {
            Id = updated.Id,
            Title = updated.Title,
            Description = updated.Description,

            CategoryId = updated.CategoryId,
            CategoryName = updated.Category.Name,
            Category = new CategoryDto { Id = updated.Category.Id, Name = updated.Category.Name },

            PriorityId = updated.PriorityId,
            PriorityName = updated.Priority.Name,
            Priority = new PriorityDto { Id = updated.Priority.Id, Name = updated.Priority.Name },

            IsCompleted = updated.IsCompleted,
            CreatedAt = updated.CreatedAt
        };
    }

    // =====================================================
    // 5. DELETE TODO
    // =====================================================
    public async Task<bool> Delete(int id)
    {
        var todo = await _context.TodoItems.FindAsync(id);

        if (todo == null)
            return false;

        _context.TodoItems.Remove(todo);
        await _context.SaveChangesAsync();

        return true;
    }

    // =====================================================
    // 6. SEARCH + FILTER
    // =====================================================
    public async Task<PaginatedTodosResponseDto> Search(string? title, int? categoryId, int? priorityId, int page = 1, int pageSize = 6)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 6;

        var query = _context.TodoItems
            .Include(t => t.Category)
            .Include(t => t.Priority)
            .AsQueryable();

        if (!string.IsNullOrEmpty(title))
        {
            query = query.Where(t => t.Title.Contains(title));
        }

        if (categoryId.HasValue)
        {
            query = query.Where(t => t.CategoryId == categoryId);
        }

        if (priorityId.HasValue)
        {
            query = query.Where(t => t.PriorityId == priorityId);
        }

        var totalCount = await query.CountAsync();

        var todos = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .Select(t => new TodoResponseDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,

                CategoryId = t.CategoryId,
                CategoryName = t.Category.Name,
                Category = new CategoryDto { Id = t.Category.Id, Name = t.Category.Name },

                PriorityId = t.PriorityId,
                PriorityName = t.Priority.Name,
                Priority = new PriorityDto { Id = t.Priority.Id, Name = t.Priority.Name },

                IsCompleted = t.IsCompleted,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync();

        var totalPages = (totalCount + pageSize - 1) / pageSize;

        return new PaginatedTodosResponseDto
        {
            Data = todos,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = totalPages
        };
    }
}
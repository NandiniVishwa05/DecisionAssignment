using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodoController : ControllerBase
{
    private readonly TodoService _service;

    public TodoController(TodoService service)
    {
        _service = service;
    }

    // =========================
    // 1. GET ALL (PAGINATION)
    // =========================
    [HttpGet]
    public async Task<IActionResult> GetAll(int page = 1, int pageSize = 6)
    {
        var result = await _service.GetPaged(page, pageSize);
        return Ok(result);
    }

    // =========================
    // 2. CREATE TODO
    // =========================
    [HttpPost]
    public async Task<IActionResult> Create(TodoCreateDto dto)
    {
        var result = await _service.Create(dto);
        return Ok(result);
    }

    // =========================
    // 3. UPDATE TODO
    // =========================
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, TodoUpdateDto dto)
    {
        var result = await _service.Update(id, dto);

        if (result == null)
            return NotFound("Todo not found");

        return Ok(result);
    }

    // =========================
    // 4. DELETE TODO
    // =========================
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.Delete(id);

        if (!result)
            return NotFound("Todo not found");

        return NoContent();
    }

    // =========================
    // 5. SEARCH + FILTER
    // =========================
    [HttpGet("search")]
    public async Task<IActionResult> Search(
        string? title,
        int? categoryId,
        int? priorityId,
        int page = 1,
        int pageSize = 6)
    {
        var result = await _service.Search(title, categoryId, priorityId, page, pageSize);
        return Ok(result);
    }
}
using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PriorityController : ControllerBase
{
    private readonly PriorityService _service;

    public PriorityController(PriorityService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAll();
        return Ok(result);
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchByName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return BadRequest("Name query parameter is required");

        var result = await _service.SearchByName(name);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreatePriorityDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest("Priority name is required");

        var result = await _service.Create(dto);
        return CreatedAtAction(nameof(GetAll), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdatePriorityDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest("Priority name is required");

        var result = await _service.Update(id, dto);
        if (result == null)
            return NotFound($"Priority with id {id} not found");

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.Delete(id);
        if (!result)
            return NotFound($"Priority with id {id} not found");

        return NoContent();
    }
}
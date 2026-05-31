using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class PriorityService
{
    private readonly ApplicationDbContext _context;

    public PriorityService(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET ALL PRIORITIES (CLEAN DTO RESPONSE)
    public async Task<List<PriorityDto>> GetAll()
    {
        return await _context.Priorities
            .AsNoTracking()
            .Select(p => new PriorityDto
            {
                Id = p.Id,
                Name = p.Name
            })
            .ToListAsync();
    }

    // SEARCH PRIORITIES BY NAME
    public async Task<List<PriorityDto>> SearchByName(string name)
    {
        return await _context.Priorities
            .Where(p => p.Name.Contains(name))
            .AsNoTracking()
            .Select(p => new PriorityDto
            {
                Id = p.Id,
                Name = p.Name
            })
            .ToListAsync();
    }

    // CREATE NEW PRIORITY
    public async Task<PriorityDto> Create(CreatePriorityDto dto)
    {
        var priority = new Priority { Name = dto.Name };
        _context.Priorities.Add(priority);
        await _context.SaveChangesAsync();

        return new PriorityDto { Id = priority.Id, Name = priority.Name };
    }

    // UPDATE PRIORITY
    public async Task<PriorityDto?> Update(int id, UpdatePriorityDto dto)
    {
        var priority = await _context.Priorities.FindAsync(id);
        if (priority == null)
            return null;

        priority.Name = dto.Name;
        _context.Priorities.Update(priority);
        await _context.SaveChangesAsync();

        return new PriorityDto { Id = priority.Id, Name = priority.Name };
    }

    // DELETE PRIORITY
    public async Task<bool> Delete(int id)
    {
        var priority = await _context.Priorities.FindAsync(id);
        if (priority == null)
            return false;

        _context.Priorities.Remove(priority);
        await _context.SaveChangesAsync();
        return true;
    }
}
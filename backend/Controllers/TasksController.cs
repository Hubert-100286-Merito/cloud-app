using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;

    public TasksController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskReadDto>>> GetTasks()
    {
        var tasks = await _context.Tasks
            .Select(t => new TaskReadDto { Id = t.Id, Title = t.Title, IsCompleted = t.IsCompleted })
            .ToListAsync();
        return Ok(tasks);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskReadDto>> GetTask(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound();
        
        return new TaskReadDto { Id = task.Id, Title = task.Title, IsCompleted = task.IsCompleted };
    }

    [HttpPost]
    public async Task<ActionResult<TaskReadDto>> PostTask(TaskCreateDto taskDto)
    {
        var task = new TaskItem { Title = taskDto.Title, IsCompleted = false };
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        var readDto = new TaskReadDto { Id = task.Id, Title = task.Title, IsCompleted = task.IsCompleted };
        return CreatedAtAction(nameof(GetTask), new { id = task.Id }, readDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutTask(int id, TaskReadDto taskDto)
    {
        if (id != taskDto.Id) return BadRequest();
        
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound();

        task.Title = taskDto.Title;
        task.IsCompleted = taskDto.IsCompleted;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound();
        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
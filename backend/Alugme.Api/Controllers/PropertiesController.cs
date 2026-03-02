
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Alugme.Api.Data;
using Alugme.Api.Domain;

namespace Alugme.Api.Controllers;

[ApiController]
[Route("api/properties")]
[Authorize]
public class PropertiesController : ControllerBase {
  private readonly AppDbContext _db;
  public PropertiesController(AppDbContext db){ _db=db; }

  [HttpGet]
  [AllowAnonymous]
  public async Task<IEnumerable<Property>> Get() => await _db.Properties.ToListAsync();

  [HttpPost]
  public async Task<IActionResult> Post(Property p){
    _db.Properties.Add(p);
    await _db.SaveChangesAsync();
    return CreatedAtAction(nameof(Get), new{ id=p.Id}, p);
  }

  [HttpPut("{id}")]
  public async Task<IActionResult> Put(Guid id, Property p){
    var existing = await _db.Properties.FindAsync(id);
    if(existing==null) return NotFound();
    _db.Entry(existing).CurrentValues.SetValues(p);
    await _db.SaveChangesAsync();
    return NoContent();
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> Delete(Guid id){
    var existing = await _db.Properties.FindAsync(id);
    if(existing==null) return NotFound();
    _db.Remove(existing);
    await _db.SaveChangesAsync();
    return NoContent();
  }
}

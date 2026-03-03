using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Alugme.Api.Controllers;

[ApiController]
[Route("api/upload")]
[Authorize]
public class UploadController : ControllerBase {
  private readonly IWebHostEnvironment _env;

  public UploadController(IWebHostEnvironment env) { _env = env; }

  [HttpPost]
  public async Task<IActionResult> Upload(IFormFile file) {
    if (file == null || file.Length == 0)
      return BadRequest(new { message = "Nenhum arquivo enviado" });

    var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp", "image/gif" };
    if (!allowedTypes.Contains(file.ContentType.ToLower()))
      return BadRequest(new { message = "Tipo de arquivo não permitido. Use JPG, PNG, WEBP ou GIF." });

    if (file.Length > 5 * 1024 * 1024)
      return BadRequest(new { message = "Arquivo muito grande. Máximo 5MB." });

    var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
    var uploadsDir = Path.Combine(webRoot, "uploads");
    Directory.CreateDirectory(uploadsDir);

    var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
    var fileName = $"{Guid.NewGuid()}{ext}";
    var filePath = Path.Combine(uploadsDir, fileName);

    using var stream = new FileStream(filePath, FileMode.Create);
    await file.CopyToAsync(stream);

    var url = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";
    return Ok(new { url });
  }
}

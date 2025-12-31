using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServiceRequest.Models;
using ServiceRequest.DTOs;
using ServiceRequest.Models.Enums;

namespace ServiceRequest.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiceRequestController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ServiceRequestController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ServiceRequestDTO dto)
        {
            if (dto == null)
                return BadRequest("Request data is required.");

            var request = new Models.ServiceRequest
            {
                Title = dto.Title,
                Description = dto.Description,
                RequestType = dto.RequestType,
                //RequestNumber = $"REQ-{Guid.NewGuid().ToString("N")[..8]}",
                Priority = dto.Priority,
                CreatedBy = dto.CreatedBy,
                Status = Status.Draft,
                CreatedDate = DateTime.UtcNow
            };

            _context.ServiceRequests.Add(request);
            await _context.SaveChangesAsync();
            request.RequestNumber = $"REQ-{DateTime.UtcNow.Year}-{request.Id:D6}";
            await _context.SaveChangesAsync();

            return Ok(request);

        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var allRequests = await _context.ServiceRequests.ToListAsync();
            return Ok(allRequests);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var request = await _context.ServiceRequests.FindAsync(id);
            if (request == null)
                return NotFound();

            return Ok(request);
        }
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> Edit(int id, [FromBody] ServiceRequestDTO dto)
        {
            var request = await _context.ServiceRequests.FindAsync(id);
            if (request == null)
                return NotFound();
            //if (request.Status != Status.Draft)
            //    return BadRequest("Only Draft requests can be edited.");
            request.Title = dto.Title;
            request.Description = dto.Description;
            request.RequestType = dto.RequestType;
            request.CreatedBy = dto.CreatedBy;
            request.Priority = dto.Priority;
            request.UpdatedDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok(request);
        }

        [HttpPut("submit/{id}")]
        public async Task<IActionResult> Submit(int id)
        {
            var request = await _context.ServiceRequests.FindAsync(id);
            if (request == null)
                return NotFound();

            if (request.Status != Status.Draft)
                return BadRequest("Only Draft requests can be submitted.");

            request.Status = Status.Submitted;
            request.UpdatedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(request);
        }
        [HttpPut("approve/{id}")]
        public async Task<IActionResult> Approve(int id)
        {
            var request = await _context.ServiceRequests.FindAsync(id);
            if (request == null)
                return NotFound();

            if (request.Status != Status.Submitted)
                return BadRequest("Only Submitted requests can be approved.");

            request.Status = Status.Approved;
            request.UpdatedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(request);
        }
        [HttpPut("reject/{id}")]
        public async Task<IActionResult> Reject(int id)
        {
            var request = await _context.ServiceRequests.FindAsync(id);
            if (request == null)
                return NotFound();

            if (request.Status != Status.Submitted)
                return BadRequest("Only Submitted requests can be rejected.");

            request.Status = Status.Rejected;
            request.UpdatedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(request);
        }


        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var request = await _context.ServiceRequests.FindAsync(id);
            if (request == null)
                return NotFound();
            _context.ServiceRequests.Remove(request);
            await _context.SaveChangesAsync();
            return NoContent();
        }



        [HttpPost("attachments/{id}")]
        public async Task<IActionResult> UploadAttachment(int id, IFormFile file)
        {
            var request = await _context.ServiceRequests.FindAsync(id);
            if (request == null)
                return NotFound("Request not found");

            if (file == null || file.Length == 0)
                return BadRequest("Invalid file");

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var attachment = new Attachment
            {
                FileName = file.FileName,
                FilePath = filePath,
                ContentType = file.ContentType,
                ServiceRequestId = request.Id
            };

            _context.Attachments.Add(attachment);
            await _context.SaveChangesAsync();


            var response = new AttachmentDTO
            {
                Id = attachment.Id,
                FileName = attachment.FileName,
                FilePath=attachment.FilePath,
                ContentType = attachment.ContentType,
                UploadedDate = attachment.UploadedDate
            };

            return Ok(response);
        }
        [HttpGet("attachment/{requestId}")]
        public async Task<IActionResult> GetAttachments(int requestId)
        {
            var attachments = await _context.Attachments
                .Where(a => a.ServiceRequestId == requestId)
                .Select(a => new Attachment
                {
                    Id = a.Id,
                    FileName = a.FileName,
                    ContentType = a.ContentType,
                    UploadedDate = a.UploadedDate
                })
                .ToListAsync();
            return Ok(attachments);
        }

        [HttpDelete]

        [Route("attachment/{attachmentId}")]
        public async Task<IActionResult> DeleteAttachment(int attachmentId)
        {
            var attachment = await _context.Attachments.FindAsync(attachmentId);
            if (attachment == null)
                return NotFound("Attachment not found");
            if (System.IO.File.Exists(attachment.FilePath))
            {
                System.IO.File.Delete(attachment.FilePath);
            }
            _context.Attachments.Remove(attachment);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    } 
}

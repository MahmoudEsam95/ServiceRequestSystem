using ServiceRequest.Models;
using ServiceRequest.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace ServiceRequest.Models
{
    public class ServiceRequest
    {
            public int Id { get; set; }
           
            public string? RequestNumber { get; set; } 

            public string? Title { get; set; } 
            public string? Description { get; set; } 

            public RequestType RequestType { get; set; }
            public Priority Priority { get; set; }
            public Status Status { get; set; } 

            public string? CreatedBy { get; set; } 
            public string? AssignedTo { get; set; }

            public DateTime CreatedDate { get; set; } 
            public DateTime UpdatedDate { get; set; }
            public ICollection<Attachment>? Attachments { get; set; }



    }
}

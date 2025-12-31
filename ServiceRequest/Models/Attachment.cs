using System.Text.Json.Serialization;

namespace ServiceRequest.Models
{
    public class Attachment
    {
        public int Id { get; set; }

        public string? FileName { get; set; } 
        public string? FilePath { get; set; } 
        public string? ContentType { get; set; }

        public DateTime UploadedDate { get; set; } 

        public int ServiceRequestId { get; set; }

        public ServiceRequest? ServiceRequest { get; set; } 
    }
}

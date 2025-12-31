using ServiceRequest.Models.Enums;

namespace ServiceRequest.DTOs
{
    public class ServiceRequestDTO
    {
        public string? Title { get; set; } 
        public string? Description { get; set; }
        public RequestType RequestType { get; set; }
        public Priority Priority { get; set; }
        public string? CreatedBy { get; set; }

    }

}

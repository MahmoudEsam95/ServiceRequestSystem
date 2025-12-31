namespace ServiceRequest.DTOs
{
    public class AttachmentDTO
    {
        public int Id { get; set; }
        public string? FileName { get; set; }
        public string? FilePath { get; set; }

        public string? ContentType { get; set; } 
        public DateTime UploadedDate { get; set; }
    }
}

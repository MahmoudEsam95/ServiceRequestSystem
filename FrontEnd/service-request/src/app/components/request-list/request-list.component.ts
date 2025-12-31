import { Component, OnInit } from '@angular/core';
import { Attachment } from 'src/app/models/Attachment';
import { Priority } from 'src/app/models/Enums/priority.enum';
import { RequestType } from 'src/app/models/Enums/request-type.enum';
import { Status } from 'src/app/models/Enums/status.enum';
import { ServiceRequest } from 'src/app/models/ServiceRequest';
import { ServiceRequestService } from 'src/services/service-request.service';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})
export class RequestListComponent implements OnInit {

  Priority = Priority;
  Status = Status;
  RequestType = RequestType;
  requests:ServiceRequest[] = [];
  selectedFile: File | null = null;
  attachmentsMap: { [key: number]: Attachment[] } = {};

onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];
}

  constructor(private ServiceReq: ServiceRequestService) { }

  ngOnInit(): void {
    this.ServiceReq.getallServiceRequests().subscribe(res => this.requests = res);

}
deleteRequest(id:number){
  this.ServiceReq.deleteServiceRequest(id).subscribe(() => {
    this.requests = this.requests.filter(request => request.id !== id);
  });

}

upload(RequestID: number) {
  if (!this.selectedFile) {
    alert('اختار ملف الأول');
    return;
  }

  this.ServiceReq.uploadAttachment(this.selectedFile, RequestID)
    .subscribe({
      next: () => {
        alert('Attachment uploaded successfully');
        this.loadAttachments(RequestID);
        this.selectedFile = null;
      },
      error: err => {
        console.error(err);
        alert('Upload failed');
      }
    });
}


loadAttachments(requestId: number) {
  this.ServiceReq.getAttachments(requestId).subscribe(res => {
    this.attachmentsMap[requestId] = res;
    if (res.length === 0) {
      alert('No attachments found for this request.');
    }
  });
}

}
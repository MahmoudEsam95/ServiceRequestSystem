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
  requests: ServiceRequest[] = [];
  attachmentsMap: { [key: number]: Attachment[] } = {};
  attachmentsVisible: { [key: number]: boolean } = {};
  selectedFilesMap: { [key: number]: File[] } = {};
  imagePreviewsMap: { [key: number]: { [key: string]: string } } = {};
  textPreviewsMap: { [key: number]: { [key: string]: string } } = {};





  onFilesSelected(event: any, requestId: number) {
    const files = Array.from(event.target.files) as File[];

    this.selectedFilesMap[requestId] = files;
    this.imagePreviewsMap[requestId] = {};
    this.textPreviewsMap[requestId] = {};

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        this.imagePreviewsMap[requestId][file.name] =
          URL.createObjectURL(file);
      }

      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = () => {
          this.textPreviewsMap[requestId][file.name] =
            (reader.result as string).substring(0, 300);
        };
        reader.readAsText(file);
      }
    });
  }


  constructor(private ServiceReq: ServiceRequestService) { }

  ngOnInit(): void {
    this.ServiceReq.getallServiceRequests().subscribe(res => this.requests = res);

  }
  deleteRequest(id: number) {
    if (!confirm('Are you sure you want to delete this request?')) return;
    this.ServiceReq.deleteServiceRequest(id).subscribe(() => {
      this.requests = this.requests.filter(request => request.id !== id);
    });

  }
  uploadMultiple(requestId: number) {
    const files = this.selectedFilesMap[requestId];
    if (!files || files.length === 0) return;

    files.forEach(file => {
      this.ServiceReq.uploadAttachment(file, requestId)
        .subscribe(() => this.loadAttachments(requestId));
    });

    this.selectedFilesMap[requestId] = [];
    this.imagePreviewsMap[requestId] = {};
    this.textPreviewsMap[requestId] = {};
  }
  removeFile(requestId: number, file: File) {
    this.selectedFilesMap[requestId] =
      this.selectedFilesMap[requestId].filter(f => f !== file);

    if (this.imagePreviewsMap[requestId]?.[file.name]) {
      URL.revokeObjectURL(this.imagePreviewsMap[requestId][file.name]);
      delete this.imagePreviewsMap[requestId][file.name];
    }

    if (this.textPreviewsMap[requestId]?.[file.name]) {
      delete this.textPreviewsMap[requestId][file.name];
    }
  }
  loadAttachments(requestId: number) {
    this.ServiceReq.getAttachments(requestId).subscribe(res => {
      this.attachmentsMap[requestId] = res;
      if (res.length === 0) {
        alert('No attachments found for this request.');
      }
    });
  }
  toggleAttachments(requestId: number) {

    if (this.attachmentsVisible[requestId]) {
      this.attachmentsVisible[requestId] = false;
      return;
    }

   
    if (!this.attachmentsMap[requestId]) {
      this.ServiceReq.getAttachments(requestId).subscribe(res => {
        this.attachmentsMap[requestId] = res;
        this.attachmentsVisible[requestId] = true;

        if (res.length === 0) {
          alert('No attachments found for this request.');
        }
      });
    }
    else {
      this.attachmentsVisible[requestId] = true;
    }
  }
  previewAttachment(att: any) {
    this.ServiceReq.previewAttachment(att.id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }
  deleteAttachment(requestId: number, attachmentId: number) {
    if (!confirm('Are you sure you want to delete this attachment?')) return;

    this.ServiceReq.deleteAttachment(attachmentId).subscribe(() => {
      this.attachmentsMap[requestId] =
        this.attachmentsMap[requestId].filter(a => a.id !== attachmentId);
    });
  }



}
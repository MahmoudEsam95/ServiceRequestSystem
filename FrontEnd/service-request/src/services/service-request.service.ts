import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Attachment } from 'src/app/models/Attachment';
import { ServiceRequestDto } from 'src/app/models/DTOs/service-request-dto';
import { ServiceRequest } from 'src/app/models/ServiceRequest';

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestService {

  private apiUrl = 'https://localhost:44303/api/ServiceRequest/';

  constructor(private http: HttpClient) { }

  getallServiceRequests(): Observable<ServiceRequest[]> {

    return this.http.get<ServiceRequest[]>(this.apiUrl);

  }
  uploadAttachment(file: File, requestId: number): Observable<void> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post<void>(this.apiUrl + `attachments/${requestId}`, formData);
  }
  getAttachments(requestId: number) {
    return this.http.get<Attachment[]>(
      `${this.apiUrl}attachment/${requestId}`);
  }
  previewAttachment(attachmentId: number) {
    return this.http.get(
      `${this.apiUrl}attachments/preview/${attachmentId}`,
      { responseType: 'blob' }
    );
  }
  deleteAttachment(attachmentId: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + `attachment/${attachmentId}`);
  }
  createServiceRequest(dto: ServiceRequestDto) {
    return this.http.post<ServiceRequest>(this.apiUrl, dto);
  }

  editServiceRequest(ServiceRequestDto: any): Observable<ServiceRequest> {
    return this.http.put<ServiceRequest>(this.apiUrl + `edit/${ServiceRequestDto.id}`, ServiceRequestDto);
  }

  submitServiceRequest(id: number): Observable<void> {
    return this.http.put<void>(this.apiUrl + `submit/${id}`, {});
  }
  approveServiceRequest(id: number): Observable<void> {
    return this.http.put<void>(this.apiUrl + `approve/${id}`, {});
  }
  rejectServiceRequest(id: number): Observable<void> {
    return this.http.put<void>(this.apiUrl + `reject/${id}`, {});
  }

  getServiceRequestById(id: number): Observable<ServiceRequest> {
    return this.http.get<ServiceRequest>(this.apiUrl + id);
  }
  deleteServiceRequest(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + `delete/${id}`);
  }
}

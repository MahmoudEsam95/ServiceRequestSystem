import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceRequestDto } from 'src/app/models/DTOs/service-request-dto';
import { Priority } from 'src/app/models/Enums/priority.enum';
import { RequestType } from 'src/app/models/Enums/request-type.enum';
import { Status } from 'src/app/models/Enums/status.enum';
import { ServiceRequestService } from 'src/services/service-request.service';

@Component({
  selector: 'app-update-request',
  templateUrl: './update-request.component.html',
  styleUrls: ['./update-request.component.css']
})
export class UpdateRequestComponent implements OnInit {

onFileSelected($event: Event) {
throw new Error('Method not implemented.');
}

  RequestID!: number;  
  requestData: any;
  Status = Status;
  RequestType = RequestType;
  Priority = Priority;
  updateSuccess = false;
  
  constructor(private serviceReq: ServiceRequestService, private route: ActivatedRoute, private router: Router) { }


  ngOnInit(): void {

    this.RequestID = Number(this.route.snapshot.params['id']);
    this.getRequestById(this.RequestID);
  }


updateRequest(serviceReqDto: any) {

  this.serviceReq.editServiceRequest(serviceReqDto).subscribe({
    next: () => {
      this.updateSuccess = true;

      setTimeout(() => {
        this.updateSuccess = false;
      }, 3000);
    },
    error: (err) => {
      console.error('Update failed', err);
    }
  });
}



  getRequestById(id: number) {
    this.serviceReq.getServiceRequestById(id).subscribe(response => {
       this.requestData = response;
      console.log('Service request fetched successfully', response);
    }, error => {
      console.error('Error fetching service request', error);
    });
  }


  submittRequest(id: number) {
    this.serviceReq.submitServiceRequest(id).subscribe(() => {
      console.log('Service request submitted successfully');
      this.router.navigate(['/request-list']);
    }, error => {
      console.error('Error submitting service request', error);
    });
  }

  approveRequest(id: number) {
    this.serviceReq.approveServiceRequest(id).subscribe(() => {
      console.log('Service request approved successfully');
      this.router.navigate(['/request-list']);
    }, error => {
      console.error('Error approving service request', error);
    });
  }
  rejectRequest(id: number) {
    this.serviceReq.rejectServiceRequest(id).subscribe(() => {
      console.log('Service request rejected successfully');
      this.router.navigate(['/request-list']);
    }, error => {
      console.error('Error rejecting service request', error);
    });
  }


    uploadAttachment(file: File, requestId: number) {
    this.serviceReq.uploadAttachment(file, requestId).subscribe({
      next: () => {
        console.log('Attachment uploaded successfully');
      },
      error: (err) => {
        console.error('Error uploading attachment', err);
      }
    });
  }

  getEnumValues(enumObj: object): number[] {
    return Object.values(enumObj)
      .filter((v): v is number => typeof v === 'number');
  }


}




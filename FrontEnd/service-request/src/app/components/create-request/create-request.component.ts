import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceRequestDto } from 'src/app/models/DTOs/service-request-dto';
import { Priority } from 'src/app/models/Enums/priority.enum';
import { RequestType } from 'src/app/models/Enums/request-type.enum';
import { ServiceRequestService } from 'src/services/service-request.service';
@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.css']
})
export class CreateRequestComponent {

  Priority = Priority;
  RequestType = RequestType;

  constructor(private serviceReq: ServiceRequestService, private router: Router) {}

  createRequest(requestData: ServiceRequestDto) {
    this.serviceReq.createServiceRequest(requestData).subscribe({
      next: (res) => {
        console.log('Service request created successfully', res);
        this.router.navigate(['/request-list']);
      },
      error: (err) => {
        console.error('Error creating service request', err);
      }
    });
  }



  getEnumValues(enumObj: object): number[] {
    return Object.values(enumObj)
      .filter((v): v is number => typeof v === 'number');
  }
}

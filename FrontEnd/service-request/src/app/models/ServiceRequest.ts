import { Priority } from "./Enums/priority.enum";
import { RequestType } from "./Enums/request-type.enum";
import { Status } from "./Enums/status.enum";

export interface ServiceRequest {
 id: number;

  requestNumber?: string;

  title?: string;
  description?: string;

  requestType: RequestType;
  priority: Priority;
  status: Status;

  createdBy?: string;
  assignedTo?: string;

  createdDate: string;   
  updatedDate: string;   
}
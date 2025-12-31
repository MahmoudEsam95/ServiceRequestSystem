import { Priority } from '../Enums/priority.enum';
import { RequestType } from '../Enums/request-type.enum';  
import { Status } from '../Enums/status.enum';


export interface ServiceRequestDto {
  title: string;
  description?: string;
  requestType: RequestType;
  priority: Priority;
  createdBy: string;
  attachments?: File[];
}

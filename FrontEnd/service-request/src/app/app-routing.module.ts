import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestListComponent } from './components/request-list/request-list.component';
import { UpdateRequestComponent } from './components/update-request/update-request.component';
import { CreateRequestComponent } from './components/create-request/create-request.component';

const routes: Routes = [

{path:'',component:RequestListComponent},
{path:'request-list',component:RequestListComponent},
{path:'update-request/:id',component:UpdateRequestComponent},
{path:`create-request`,component:CreateRequestComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

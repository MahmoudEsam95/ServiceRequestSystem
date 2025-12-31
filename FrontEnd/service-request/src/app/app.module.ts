import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule as httpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RequestListComponent } from './components/request-list/request-list.component';
import { CreateRequestComponent } from './components/create-request/create-request.component';
import { UpdateRequestComponent } from './components/update-request/update-request.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    RequestListComponent,
    CreateRequestComponent,
    UpdateRequestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    httpClientModule,
     FormsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

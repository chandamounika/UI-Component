import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from './shared/lib/date-formatter/custom-date-formater';
import { appRouting } from './app.routes';
import { SharedModule } from './shared/shared.module';

import { CommonPageModule } from './pages/common.module';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    appRouting,
    SharedModule,
    CommonPageModule
  ],
  providers: [{provide: NgbDateParserFormatter, useFactory: () => new NgbDateFRParserFormatter('shortDate')}],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MydeqFooterComponent } from './nav/mydeq-footer/mydeq-footer.component';
import { MydeqHeaderComponent } from './nav/mydeq-header/mydeq-header.component';

import { Utils } from './Utils';
import { Helper } from './helper';
import {MyDeqErrorHandler} from './errorHandler';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbAccordionConfig, NgbDatepickerConfig, NgbActiveModal,
         NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { ManagerService } from '../service/manager.service';
import {PageConentService} from '../core/content/content-service.component';
import { MydeqAlertModalComponent } from './modals/alert-modal/alert.component';
import { PageNotFoundComponent } from './pages/error/404-page/404.component';
import { SessionTimeOutModalComponent } from './modals/session-timeout/timeout.component';
import { DataTableModule } from './lib/datatable/DataTableModule';
import { PhonePipe } from './lib/PhonePipe';
import {ConcatStringPipe} from './lib/ConcatStringPipe';
import { LoggerService } from './lib/logger/logger-service.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DataTableModule,
    NgbModule
  ],
  declarations: [
    MydeqHeaderComponent,
    MydeqFooterComponent,    
    SessionTimeOutModalComponent,
    MydeqAlertModalComponent,
    PageNotFoundComponent,
    PhonePipe,
    ConcatStringPipe,

  ],
  exports: [
    MydeqHeaderComponent, MydeqFooterComponent, SessionTimeOutModalComponent, MydeqAlertModalComponent, PhonePipe,
    PageNotFoundComponent, DataTableModule, NgbModule, ConcatStringPipe
  ],

  providers: [
    Utils, MyDeqErrorHandler, ManagerService, PageConentService, PhonePipe, NgbAccordionConfig,
    NgbDatepickerConfig, NgbActiveModal, NgbPopoverConfig, LoggerService, Helper
  ],
  //entryComponents: [MydeqAlertModalComponent]
})
export class SharedModule {}

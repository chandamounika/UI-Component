import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule  } from '@angular/forms';
import { commonRouting } from './common.routes';
import { CertifyComponent } from './certify/certify.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { QuestionListComponent } from './question-list/question-list.component';
import { WhatsNeededComponent } from './whats-needed/whats-needed.component';
import { AdditionalCommentsComponent } from './additional-comments/additional-comments.component';
import { ComponentPageModule } from '../components/componet.module';
import { SharedModule } from '../../shared/shared.module';
import { EachQuestion } from './question-list/each-question/each-question.component';
import {ResponsivePageComponent} from './responsive-page/responsive-page.component';
import { AppIndexComponent } from './app-index/app-index.component';
import { NotificationTestingComponent } from './notification-testing/notification-testing.component';
import { TableListingComponent } from './table-listing/table-listing.component';


@NgModule({

    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        commonRouting,
        ComponentPageModule,
        SharedModule,
        /* MyDEQCoreModule */
    ],
    declarations: [
            
        CertifyComponent,
        ConfirmationComponent,       
        QuestionListComponent,        
        AdditionalCommentsComponent,      
        WhatsNeededComponent,
        EachQuestion,  
        ResponsivePageComponent ,
        AppIndexComponent,
        NotificationTestingComponent,
        TableListingComponent    
    ],
    exports: [       
        CertifyComponent,
        ConfirmationComponent,       
        QuestionListComponent,        
        AdditionalCommentsComponent,       
        WhatsNeededComponent,
        EachQuestion,
        ResponsivePageComponent ,
        AppIndexComponent,
        NotificationTestingComponent  
    ]
})
export class CommonPageModule{}




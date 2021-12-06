import { BasePageContent } from "../../../core/content/base-page-content.component";
import * as _ from 'lodash-es';

export class PagecontentAppIndex extends BasePageContent{
    getPageSpecificText(){

        this.PAGE_TEXT['cc'] = {
            
            header: `What are the characteristics of the USTs installed?`,
            sub_header:`To modify a section, click the pencil icon. Once finished modifying that section, repeat as needed until all sections are updated and click SAVE & CONTINUE.`,
            
            lbl_header_section:`Section`,
            lbl_header_status:`Status`,
            lbl_header_edit:`Edit`,
            lbl_revision_required:`Revision Required`,

            alert_header:`ALERT: CHANGING UST INSTALLATION INFORMATION MAY IMPACT OTHER SECTIONS`,
            alert_message:`Changing the number of UST and compartments may impact already saved information.`,

            fr_alert_header:`ALERT: UPDATED FINANCIAL RESPONSIBILITY REQUIRED`,
            fr_alert_message:`This UST Notification requires an update to Financial Responsibility (FR).<br/><br/> After the UST Notification has been approved by ADEQ, please navigate to mySTUFF and the respective UST Facility to update the FR to stay in compliance.<br/><br/> `,

            sp_alert_header:`ALERT: EDITING INFORMATION WILL REQUIRE ANOTHER SERVICE PROVIDER CERTIFICATION`,
            sp_alert_message:`Changing existing UST information will require you to reupload another service provider certification. Click CONTINUE to proceed or BACK.<br/><br/> `

        };


        this.PAGE_TEXT['ains_revision'] = this.PAGE_TEXT['ains'];
        this.PAGE_TEXT['newfc'] = this.PAGE_TEXT['ains'];
        this.PAGE_TEXT['newfc_revision']= this.PAGE_TEXT['ains'];


        this.PAGE_TEXT['amodl'] = {
            
            header: `What UST characteristics have been updated?`,
            sub_header:`To modify a section, click the pencil icon. Once finished modifying that section, repeat as needed until all sections are updated and click SAVE & CONTINUE.`,
            
            lbl_header_section:`Section`,
            lbl_header_status:`Status`,
            lbl_header_edit:`Edit`,
            lbl_revision_required:`Revision Required`,

            alert_header:`ALERT: CHANGING UST INSTALLATION INFORMATION MAY IMPACT OTHER SECTIONS`,
            alert_message:`Changing the number of UST and compartments may impact already saved information.`,

            fr_alert_header:`ALERT: UPDATED FINANCIAL RESPONSIBILITY REQUIRED`,
            fr_alert_message:`This UST Notification requires an update to Financial Responsibility (FR).<br/><br/> After the UST Notification has been approved by ADEQ, please navigate to mySTUFF and the respective UST Facility to update the FR to stay in compliance.<br/><br/> `,

            sp_alert_header:`ALERT: EDITING INFORMATION WILL REQUIRE ANOTHER SERVICE PROVIDER CERTIFICATION`,
            sp_alert_message:`Changing existing UST information will require you to reupload another service provider certification. Click CONTINUE to proceed or BACK.<br/><br/> `

        };

        this.PAGE_TEXT['amodl_revision'] = this.PAGE_TEXT['amodl'];

        this.PAGE_TEXT['amodg'] =  this.PAGE_TEXT['amodl'];
       // this.PAGE_TEXT['amodg']['sub_header'] ='To modify a section, click the pencil icon. Once finished modifying that section, repeat as needed until all sections are updated and click SAVE & CONTINUE.' 
        this.PAGE_TEXT['amodg_revision'] = this.PAGE_TEXT['amodg'];

        this.PAGE_TEXT['aoth'] = this.PAGE_TEXT['amodl'];
        this.PAGE_TEXT['aoth_revision'] = this.PAGE_TEXT['amodl'];

        this.PAGE_TEXT['aown'] = this.PAGE_TEXT['amodl'];        
        this.PAGE_TEXT['aown_revision'] = this.PAGE_TEXT['aown'];        
        
    }
}

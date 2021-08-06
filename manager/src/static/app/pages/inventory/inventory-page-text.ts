import {BasePageContent} from '../json/base-content';

export class InventoryText extends BasePageContent{

    constructor(){
        super();
        this.getPageSpecificText();
    }


    public getPageSpecificText() {
        this.PAGE_TEXT['permitinventory'] = {
            header: 'PERMIT INVENTORY',
            total: 'TOTAL',
            table: [
                {
                colName: 'LTF#',
                sortable: true,
                sortKey: 'permitId',
                type: 'data'
                },
                {
                    colName: 'Place Id',
                    sortable: true,
                    sortKey: 'placeId',
                    type: 'data'
                },
                {
                    colName: 'Place Name',
                    sortable: true,
                    sortKey: 'placeName',
                    type: 'data'
                },
                {
                    colName: 'Permit Expiry Date',
                    sortable: true,
                    sortKey: 'permitExpDate',
                    type: 'data'
                },
                {
                    colName: 'Company',
                    sortable: true,
                    sortKey: 'companyName',
                    type: 'data'
                },
                {
                    colName: 'Application Type',
                    sortable: true,
                    sortKey: 'applicationType',
                    type: 'data'
                },
                {
                    colName: 'Status',
                    sortable: true,
                    sortKey: 'templateStatus',
                    type: 'data'
                },
                {
                    colName: 'Last Approved Date',
                    sortable: true,
                    sortKey: 'lastApprovalDate',
                    type: 'data'
                },
                {
                    colName: 'View',
                    sortable: false,
                    type: 'link',
                    searchable: false,
                    linkName: 'VIEW'
                },
            ]
        };

        this.PAGE_TEXT['pendingcc'] = {
            header: 'COMPLIANCE CERTIFICATION',
            total: 'TOTAL',
            table: [
                {
                    colName: 'Place ID',
                    sortable: true,
                    sortKey: 'placeId',
                    type: 'data'
                },
                {
                    colName: 'Permit#',
                    sortable: true,
                    sortKey: 'ltfId',
                    type: 'data'
                },
                {
                    colName: 'Reporting Period',
                    sortable: true,
                    sortKey: 'reportingPeriodText',
                    type: 'data'
                },
                {
                    colName: 'Due Date',
                    sortable: true,
                    sortKey: 'reportingDueDate',
                    type: 'data'
                },
                {
                    colName: 'Submit Date',
                    sortable: true,
                    sortKey: 'reportingSubmitDate',
                    type: 'data'
                },
                {
                    colName: 'Type',
                    sortable: true,
                    sortKey: 'reqType',
                    type: 'data'
                },
                {
                    colName: 'Assigned Engineer',
                    sortable: true,
                    sortKey: 'assignedEngg',
                    type: 'data'
                },
                {
                    colName: 'Status',
                    sortable: true,
                    sortKey: 'globalReqStatus',
                    type: 'data'
                },
                {
                    colName: 'Days In-Review',
                    sortable: true,
                    sortKey: 'daysInReview',
                    type: 'data'
                },
                {
                    colName: 'View',
                    sortable: false,
                    type: 'link',
                    searchable: false,
                    linkName: 'VIEW'
                },
            ]
        };

        this.PAGE_TEXT['reviewedcc'] = {
            header: 'COMPLIANCE CERTIFICATION',
            total: 'TOTAL',
            table: [
                {
                    colName: 'Place ID',
                    sortable: true,
                    sortKey: 'placeId',
                    type: 'data'
                },
                {
                    colName: 'Permit#',
                    sortable: true,
                    sortKey: 'ltfId',
                    type: 'data'
                },
                {
                    colName: 'Reporting Period',
                    sortable: true,
                    sortKey: 'reportingPeriodText',
                    type: 'data'
                },
                {
                    colName: 'Due Date',
                    sortable: true,
                    sortKey: 'reportingDueDate',
                    type: 'data'
                },
                {
                    colName: 'Submit Date',
                    sortable: true,
                    sortKey: 'reportingSubmitDate',
                    type: 'data'
                },
                {
                    colName: 'Type',
                    sortable: true,
                    sortKey: 'reqType',
                    type: 'data'
                },
                {
                    colName: 'Assigned Engineer',
                    sortable: true,
                    sortKey: 'assignedEngg',
                    type: 'data'
                },
                {
                    colName: 'Status',
                    sortable: true,
                    sortKey: 'globalReqStatus',
                    type: 'data'
                },
                {
                    colName: 'View',
                    sortable: false,
                    type: 'link',
                    searchable: false,
                    linkName: 'VIEW'
                },
            ]
        };

        this.PAGE_TEXT['questionbank'] = {
            header: 'QUESTION BANK',
            total: 'TOTAL',
            table: [
                {
                colName: 'ID',
                sortable: true,
                sortKey: 'questionId',
                type: 'data',
                searchable: true
                },
                {
                    colName: 'Type',
                    sortable: true,
                    sortKey: 'questionType',
                    type: 'data',
                    searchable: true
                },
                {
                    colName: 'Global',
                    sortable: true,
                    sortKey: 'globalIndicator',
                    type: 'icon',
                    iconName:'fa-globe',
                    searchable: false
                },
                {
                    colName: 'Question',
                    sortable: true,
                    sortKey: 'questionText',
                    type: 'data',
                    searchable: true
                },
                {
                    colName: 'Tags',
                    sortable: false,
                    sortKey: 'questionTags',
                    type: 'data',
                    searchable: true
                },
                {
                    colName: 'Status',
                    sortable: true,
                    sortKey: 'questionStatus',
                    type: 'data',
                    searchable: true
                },
                {
                    colName: 'Edit',
                    sortable: false,
                    sortKey: '',
                    type: 'link',
                    searchable: false,
                    linkName: 'EDIT'
                },
                {
                    colName: 'Delete',
                    sortable: false,
                    sortKey: 'N',
                    type: 'icon',
                    iconName:'fas fa-trash-alt',
                    searchable: true
                }
            ]
        };

        this.PAGE_TEXT['inventory'] = {
            header: 'inventory INVENTORY',
            total: 'TOTAL',
            table: [
                {
                colName: 'LTF#',
                sortable: true,
                sortKey: 'permitId',
                type: 'data'
                },
                {
                    colName: 'Place Id',
                    sortable: true,
                    sortKey: 'placeId',
                    type: 'data'
                },
                {
                    colName: 'Place Name',
                    sortable: true,
                    sortKey: 'placeName',
                    type: 'data'
                },
                {
                    colName: 'Permit Expiry Date',
                    sortable: true,
                    sortKey: 'permitExpDate',
                    type: 'data'
                },
                {
                    colName: 'Company',
                    sortable: true,
                    sortKey: 'companyName',
                    type: 'data'
                },
                {
                    colName: 'Application Type',
                    sortable: true,
                    sortKey: 'applicationType',
                    type: 'data'
                },
                {
                    colName: 'Status',
                    sortable: true,
                    sortKey: 'templateStatus',
                    type: 'data'
                },
                {
                    colName: 'Last Approved Date',
                    sortable: true,
                    sortKey: 'lastApprovalDate',
                    type: 'data'
                },
                {
                    colName: 'View',
                    sortable: false,
                    type: 'link',
                    searchable: false,
                    linkName: 'VIEW'
                },
            ]
        };
        }
}

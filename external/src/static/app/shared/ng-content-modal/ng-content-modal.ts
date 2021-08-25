import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header mx-3 pl-0">
      <h1 class="modal-title  font-weight-bold {{!modalObj?.isDanger?'text-primary':'text-danger'}}">{{modalObj?.header | uppercase}}</h1>
    </div>
    <div class="modal-body p-3" id="ngModalBody" style="min-height: 200px;">
      <h3 [innerHTML]="modalObj.message"></h3>
    </div>
    <div class="modal-footer m-0" id="accLockFooter">
      <button *ngIf="modalObj.leftbtntext" type="button" class="btn btn-primary bottom-btn float-left m-0 px-3" (click)="activeModal.close('CANCEL click')">
        <span class="arrow left float-left">
          <i class="fa fa-chevron-left"></i>
        </span> <span class="float-right">{{modalObj?.leftbtntext}}</span>
      </button>
      <button *ngIf="modalObj.rightbtntext" type="button" class="btn bottom-btn px-3 m-0 {{modalObj?.rightbtnclass ? modalObj?.rightbtnclass : 'btn-primary' }} float-right" (click)="activeModal.close('PROCEED click')">
      <span class="float-left">{{modalObj?.rightbtntext}}</span>
        <span class="arrow right float-right">
          <i class="fa fa-chevron-right"></i>
        </span>
      </button>
    </div>
  `
})
export class NgbdModalContent implements OnInit{
  
    @Input() modalObj: any;

    constructor(public activeModal: NgbActiveModal) { 
     // console.log('In model constructor ',this.modalObj)
    }

    ngOnInit(): void {
      
    }
}
import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized, NavigationEnd, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { SessionTimeOutModalComponent } from './shared/modals/session-timeout/timeout.component';
import { Utils } from './shared/Utils';
import {PageConentService} from '../app/core/content/content-service.component';
import * as _ from 'lodash';
import { environment } from 'external/src/static/environments/environment';
import { LoggerService } from './shared/lib/logger/logger-service.component';
import { InvetoryService } from './service/invetory.service';

@Component({
  selector: 'manager-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit, AfterViewInit {
  title = 'manager';
  pageClass = '';
  @ViewChild(SessionTimeOutModalComponent) sessionTimeoutModal: SessionTimeOutModalComponent;

  constructor(
    public utils: Utils,
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pageConentService: PageConentService,
    private logger:LoggerService,
    private inventoryService: InvetoryService
    ) {
    
    logger.setProductionFlag(environment.production);   
    
    PageConentService.setInstance(pageConentService);
    router.events.subscribe(e => {
      if (e instanceof RoutesRecognized) {
        const root = e.state.root.firstChild;
        const data = this.getMetadata(root);
        this.pageClass = data.pageClass;
       // console.log('App ',e);
        this.setProcessName(e.url);
        if(data.metadata){         
          this.utils.pageMetaData = data.metadata;
        }
        
      } else if (e instanceof NavigationEnd) {
        window.scrollTo(600, 0);
        if (this.sessionTimeoutModal) {
          this.sessionTimeoutModal.exdentSession();
        }
      }

    
    });

    this.inventoryService.setRefreshCounter();

    
  
  }

  private getMetadata(inObj:any){
    if(!inObj){
      return { title: '' };
    }
    if(Object.keys(inObj.data).length === 0){
      return this.getMetadata(inObj.firstChild);
    }
    else{
      return inObj.data;
    }
  }
  ngAfterViewInit(): void {

  //   this.activatedRoute.params.subscribe((params) => {
  //     this.requestType = params["requestType"];

  //     console.log("this.requestType", this.requestType)

  //     // this.inventoryService.setRefreshCounter(this.requestType);
  // });
  }

  ngOnInit(): void {
    this.sessionTimeoutModal.init();

    this.activatedRoute.fragment.subscribe((fragment: String) => {     
     
     if(fragment && fragment === 'debug'){
        this.logger.setProductionFlag(false);
      }
      
    });

    
  }

  private setProcessName(inputurl:string){
    
      let pathArr=inputurl.split('/');
      const index=_.findIndex(pathArr,function(o){
        return o === 'applications';
      });
      if(index < pathArr.length){
           this.utils.processName = pathArr[index+1];

        //console.log('setProcessName',pathArr,index,this.utils.processName)
      }
        
  }
}

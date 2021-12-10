import { Component, ViewChild, ChangeDetectorRef, AfterViewChecked, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized, NavigationEnd, Params, ActivatedRouteSnapshot } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Utils } from './shared/Utils';
//import { Angulartics2Piwik } from 'angulartics2/piwik';

import { SessionTimeOutModalComponent } from './core/component/modals/session-timeout/timeout.component';
import { AppService } from './service/app.service';
import { LoggerService } from './shared/lib/logger/logger-service.component';
import { environment } from '../environments/environment';
import { PageConentService } from './core/content/content-service.component';
import { NeedHelpComponent } from './core/component/need-help/need-help.component';

//declare var _paq: any;

/**
 * App Component.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewChecked, OnInit, AfterViewInit {
  @ViewChild(SessionTimeOutModalComponent) sessionTimeoutModal: SessionTimeOutModalComponent;
  @ViewChild(NeedHelpComponent) helpLayer: NeedHelpComponent;

  pageClass: string = 'default-page';
  reviewComments: any[] = null;
  toggledSaveExit = false;
  showSaveAndExit: boolean = false;
  //placeBarRequired: boolean = false;
  currentComponent: any = null;
  pageTitle = 'SUBMIT AIR COMPLIANCE CERTIFICATION';
  showReturnToQL:boolean = false;
  data: any =null;
  showExit:boolean=false;
  constructor(
    public utils: Utils,
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: AppService,
    private cdRef: ChangeDetectorRef,
    private pageConentService: PageConentService,
    private logger:LoggerService,
    //private piwik: Angulartics2Piwik
    ) {
      
    logger.setProductionFlag(environment.production);
    
    PageConentService.setInstance(pageConentService);
        
    router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    /* piwik.startTracking();
    if (_paq) {
      _paq.push(['setSiteId', utils.getPiwikSiteId(window.location.hostname)]);
    } */


    (async  () => {
      if(!this.utils['mapUrl']){
        try{
          let gisData = await this.service.getGisURLS();
          this.utils['mapUrl'] = gisData.propertyMap;
        }catch(e){
          console.error('PLACE: ERROR while fetching GIS data.')
        }
      }
    })();

    router.events.subscribe(e => {
      if (window.location.pathname.endsWith('confirmation')) {
        this.utils.isConfirmationPage = true;
      }
      else {
        this.utils.isConfirmationPage = false;
      }
      if (e instanceof RoutesRecognized) {
        const root = e.state.root.firstChild;
        const queryParams: any = root.queryParamMap;
        this.data= root && root.children[0] ? root.children[0].data : { title: '' };
        if (!this.utils.glbReqId && queryParams && queryParams.params['glbReqId']) {
          this.utils.glbReqId = queryParams.params['glbReqId'];
        }
        this.pageTitle = this.data.title ? this.data.title : this.pageTitle;
        titleService.setTitle(this.pageTitle);
       
        //utils.path = utils.path ? utils.path : (root.routeConfig.path ? root.routeConfig.path : '');
 		this.utils.path = this.getPathArray(e.url);
        utils.pageURL = e.url;
        this.utils.showSaveAndExit = this.data.showSaveAndExit ? this.data.showSaveAndExit : false;       
        if(this.data.placeBarRequired ){
          this.initPlaceBar(root);        }
        this.showReturnToQL = this.data.showReturnToQL ? this.data.showReturnToQL : false;      


		if(this.data.showExit){
		          this.showExit=this.data.showExit;
		          this.utils.showSaveAndExit = false;
		        }

      } else if (e instanceof NavigationEnd) {
        if (e.url.indexOf('glbReqId') > 0) {
          this.utils.removeGlobalRequestID()
        }

        if (this.sessionTimeoutModal) {
          this.sessionTimeoutModal.exdentSession();
        }
        window.scrollTo(600, 0);
        this.router.navigated = false;
      }
     
    });

  }

   onActivate(event: any) {
    setTimeout(() => {
      this.currentComponent = event;
      if (typeof this.currentComponent.setPageReview === "function") {
        this.currentComponent.setPageReview(this);
      }

      if (this.data) {
       
        if(this.data.pageTextComp){
          PageConentService.getInstance().registerBasePageContent(event, this.data.pageTextComp);
          event.pageText = event.getPathSpecificText();
          event.pageFooterDTL={}
          event.pageFooterDTL.leftButtonTxt = event.pageText.back;
          event.pageFooterDTL.rightButtonTxt = event.pageText.saveAndContinue;        
         }  
         if(this.data.pageLoadServiceName){
          event.setPageLoadServiceName(this.data.pageLoadServiceName);
         }       
      }

      //Set Page Footer Details
      event.setDefaultPageFooterDTL();

    }, 0);
  }

  onDeactivate(event: any) {
    setTimeout(() => {
      this.utils.reviewComments = null;
      this.currentComponent = null;
    }, 0);
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();   
  }

  ngOnInit() {
    if (!this.utils.userDetails.first_name) {
      this.service.getServiceCall(null, null,null, '/mydeq/service/user').subscribe(
        response => {
          this.utils.userDetails = response;
        },
        error => {
        });
    }

    this.activatedRoute.queryParamMap.subscribe((paramMap: Params) => {     
      if(paramMap.params['debug']){
        this.logger.setProductionFlag(false);
      }      
    });


  }

  ngAfterViewInit() {
    this.sessionTimeoutModal.init();   
  }

   async initPlaceBar(root : ActivatedRouteSnapshot) {
    
    if (this.utils.placeName) {
      return;
    }
    await setTimeout(() => {
      let params: any = root.queryParamMap;
      this.logger.debug('Quesry Param',params)
      const placeID = params.params['placeId'] && params.params['placeId'] !== 'null' ? params.params['placeId'] : undefined;
      const stagingPlaceID = params.params['stage_id'] && params.params['stage_id'] !== 'null' ? params.params['stage_id'] : undefined;
      const companyCustID = params.params['cust_id'] && params.params['cust_id'] !== 'null' ? params.params['cust_id'] : undefined;
      const glbReqId = params.params['glbReqId'] ? params.params['glbReqId'] : undefined;
      if (parseInt(placeID, 10) || this.utils.placeID) {
        if (placeID) {
          this.utils.placeID = parseInt(placeID, 10);
        }
        this.getPlaceDetailsByPlaceId(this.utils.placeID);
      } else if (stagingPlaceID && companyCustID) {
        this.getPlaceDetailsByStagingID(stagingPlaceID, companyCustID);
      } else if (glbReqId) {
        this.getPlaceDetailsByGlbReqId();
      }
    }, 0);
   } 

  private getPlaceDetailsByPlaceId = (finalPlaceId: number) => {
    console.log("placeid",finalPlaceId)
    if (finalPlaceId) {
      this.service
        .getPlaceDetailsByPlaceID(finalPlaceId + '')
        .subscribe(
          recievedResponse => {
            this.setPlaceBarObj(recievedResponse);
          },
          error => {
            /* Ignored error */
            this.resetPlaceBar();
          });
    }
  }

  private getPlaceDetailsByStagingID = (stagingPlaceID, companyCustID) => {
    if (!stagingPlaceID) {
      return;
    }
    this.service
      .getPlaceDetailsByStagingID(stagingPlaceID, companyCustID)
      .subscribe(
        recievedResponse => {
          this.setPlaceBarObj(recievedResponse);
        },
        error => {
          /* Ignored error */
          this.resetPlaceBar()
        });
  }


  private getPlaceDetailsByGlbReqId = () => {
    this.service
      .getPlaceDetailsByGlbReqId()
      .subscribe(
        recievedResponse => {
          this.setPlaceBarObj(recievedResponse);
        },
        error => {
          /* Ignored error */
        });
  }

  private setPlaceBarObj = (place: any) => {
    if (place.portPlaceName) {
      this.utils.placeName = place.portPlaceName;
    } else if (place.placeAltName) {
      this.utils.placeName = place.placeAltName;
    } else {
      this.utils.placeName = place.placeName;
    }
    this.utils.placeAddress = this.utils.getCompletePlacebarAddress(place.address);
    this.utils.placeBarObj = place;
  }

  private resetPlaceBar() {
    this.utils.placeName = null;
    this.utils.placeAddress = null;
  }

  saveAndExit = () => {
    this.utils.gotoMyApplications();
  }



  toggledropdown = () => {
    this.toggledSaveExit = !this.toggledSaveExit;
  }

  editPage(event: any) {
    if (this.currentComponent) {
      this.currentComponent.approveEdit();
    }

  }

  goToQstList(){
    this.utils.navigateTo(['question-list'],true,true);
  }

  showNeedHelp() {
    this.helpLayer.loadHelp(this.utils.module, this.utils.path, this.utils.currentPageId);
  }

getPathArray(url: string): string[] {
    const segments: string[] = url ? url.split('/') : [];
    let path: string[] = [];
    for (let i = 1; i < segments.length; i++) {
      if (segments[i].indexOf('mydeq') == -1 && i < segments.length - 1) {
        path.push(segments[i]);
      }
    }

    return path;
  }

  protected exitNavigation(){
      this.utils.gotoDashboard();
  }
}

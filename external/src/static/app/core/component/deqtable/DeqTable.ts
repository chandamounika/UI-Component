import { AfterContentChecked, AfterContentInit, AfterViewInit, ComponentFactoryResolver, ComponentRef, ContentChildren, Directive, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, Renderer2, TemplateRef, ViewContainerRef } from "@angular/core";
import { SampleComponent } from "../sample/sample.component";
import { FilterEngine } from "./FilterEngine";



export interface FilterEvent{
   column:string,
   selected_filter_values:any[]
} 

@Directive({
    selector:'th[filter]',
    host:{
        '(click)':'openFilterList()'
    }
})
export class DeqTableHeaders implements AfterContentChecked,AfterViewInit{
  
    @Input('columnname') columnname=''
    @Input('displayheader') displayheader=''
    @Input('filtervalues') filtervalues=[]
    @Output('selectedFilters') selected_filters = new EventEmitter<FilterEvent>()

    
    constructor(private el: ElementRef,private renderer:Renderer2,
        public viewContainerRef: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver){

      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SampleComponent);
      const newcomp= viewContainerRef.createComponent(componentFactory)
      renderer.appendChild(viewContainerRef.element.nativeElement,newcomp.location.nativeElement)      
    }

    openFilterList(){
       
        this.selected_filters.emit({
            column:this.columnname,
            selected_filter_values:[]
        })
    }

    ngAfterContentChecked(): void {
       
    }

    ngAfterViewInit() {
     const columnHeader=this.el.nativeElement as HTMLElement

     //console.log("Original ",columnHeader.textContent)

     const div=this.renderer.createElement('sample')
     //const txt=this.renderer.createText(this.displayheader)
     
    // this.renderer.appendChild(div,txt)
     this.renderer.appendChild(columnHeader,div)

     /*this.el.nativeElement.innerHTML = null
     if(inner.length > 0){
        
         for(let i=0;i<inner.length;i++){            
            this.renderer.appendChild(div,this.renderer.createElement(inner[i]))
         }
       
      
     }else{
        this.renderer.appendChild(div,this.renderer.createElement(inner[0]))
     }    

      this.renderer.appendChild(this.el.nativeElement,div)*/
    }

}


@Directive({
    selector:'table[deqTable]',
    exportAs:'deqDataTable'
})
export class DeqTable implements OnInit, AfterContentInit{

@ContentChildren(DeqTableHeaders, { descendants: true }) headers: QueryList<DeqTableHeaders>;



@Input('deqTable') inputList;
@Input('filter_columns') columnlist=[];

public records;
private filterengine:FilterEngine
private filterMetadata

constructor(){
    this.filterengine = new FilterEngine()
}

ngAfterContentInit() {
    //let latestFilterMap = this.filterengine.get_latest_filters(this.filterMetadata,'activityId')
    //console.log("Latest Filter map ",this.headers.length)
    this.headers.forEach(header => {
        header.filtervalues = this.filterengine.get_latest_filters(this.filterMetadata,header.columnname)
    });
  }

ngOnInit(): void {
    if(this.inputList && this.inputList.length > 0){       
        this.filterMetadata =  this.filterengine.init(this.inputList,this.columnlist)       
        this.records = this.filterengine.get_filtered_records(this.inputList,this.filterMetadata)
    }else{
        this.records = this.inputList
    }
}


}
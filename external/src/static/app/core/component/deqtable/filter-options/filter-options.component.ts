import { AfterContentInit, AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'filter-options',
  templateUrl: './filter-options.component.html'
  
})
export class FilterOptionsComponent implements OnInit, AfterContentInit {

  readonly DROPDOWN='DROPDOWN'
  readonly CHECKBOX='CHECKBOX'
  readonly RADIO='RADIO'

  @Input() option_list
  @Input() column_header
  @Input() display_header
  @Input() filter_type: 'DROPDOWN' | 'CHECKBOX' | 'RADIO'
  @Input() isBoolean
  @Input() filterChangeHandler

  //@Output() filterChange = new EventEmitter<any>();

  private selectedFilters=new Set()
  constructor() { }
  ngAfterContentInit(): void {
    setTimeout(()=>{
      switch(this.filter_type){
        case this.RADIO:  
        case this.DROPDOWN:        
          break;
        default:          
        this.option_list.forEach(element => this.selectedFilters.add(element))
        break;
  
      }
    },0)
  
  }


  ngOnInit(): void {
   
  }
  
  
  onDropDownChange(event) {    
    this.selectedFilters.clear()
    this.selectedFilters.add(event?.target?.value)    
    this.filterRecords();
  }

  onCheckBoxChange(event) {
    console.log("checkbox changed")
    if(event?.target?.checked){
      this.selectedFilters.add(event?.target?.value)
    }else{
      this.selectedFilters.delete(event?.target?.value)
    }
    this.filterRecords(); 
  }

  onRadioChange(event) {
    this.selectedFilters.clear()
    this.selectedFilters.add(event?.target?.value)
    
    this.filterRecords(); 
  }



  filterRecords() {   
    this.filterChangeHandler()({column_name:this.column_header,
      selected_values:Array.from(this.selectedFilters)})
  }

  apply_all_filters(){
    
    switch(this.filter_type){
      case this.RADIO:  
      case this.DROPDOWN:        
        break;
      default:
        this.selectedFilters.clear()
      this.option_list.forEach((element,i) => {
        (document.getElementById('checkbox'+i) as HTMLInputElement).checked = true
        this.selectedFilters.add(element)
      })
      this.filterRecords();


      break;
    }
  }
}

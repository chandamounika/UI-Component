import * as _ from 'lodash-es'

export class Paginator{
    
/** PURE FUNCTION */

/**
 * For given page number and number of records to be displayed, it returns lower and higher index from record set.
 */
 public get_record_range_onpage=(_current_state)=>{
    return this.get_record_range_onpage_helper(_current_state.active_page,_current_state.records_perpage,_current_state.total_records)
}
private get_record_range_onpage_helper=(pagenumber,records_per_page,totalrecords)=>{
    let _min = ((pagenumber-1)* records_per_page)+1
    let _max = Math.min(_min + records_per_page, totalrecords+1)

return {
        lowerIndex:_min-1,
        upperIndex:_max-2
    }
}

private calculate_paging_window=(total_records,totalpages,current_page,pagingwindowsize=5,isFirstpage=false,isLastPage=false)=>{

    if(isFirstpage){
        return _.range(1,Math.min(pagingwindowsize,totalpages)+1)
    }else if(isLastPage){             
        return _.range(Math.max(1,(totalpages+1)-pagingwindowsize),totalpages+1)
    }else{      
        let _max = Math.min(current_page+Math.max((total_records % pagingwindowsize),2),totalpages) +1
        let _min = Math.max(1,(_max - pagingwindowsize))
       
        //console.log("::",_min,_max,_.range(_min,_max))
        return _.range(_min,_max)
    }
}
private get_new_paginination_state=(_totalpages,_pagingwindowsize=5,_currentpage=1,_isFirstpage=false,_isLastPage=false,_total_records=0,_records_perpage=15)=>{
    return {
        totalpages:_totalpages,
        pagingwindowsize:_pagingwindowsize,
        currentpagingwindow:this.calculate_paging_window(_total_records,_totalpages,_currentpage,_pagingwindowsize,_isFirstpage,_isLastPage),
        active_page:_currentpage,
        isFirstpage:_isFirstpage,
        isLastPage:_isLastPage,
        total_records:_total_records,
        records_perpage:_records_perpage,
        active_page_record_range: this.get_record_range_onpage_helper(_currentpage,_records_perpage,_total_records)
    }

}
public initiate_paginator=(totalrecords,recordsperpage,pagingwindowsize=5)=>{    
    return  this.get_new_paginination_state(Math.ceil(totalrecords/recordsperpage),pagingwindowsize,1,true,false,totalrecords,recordsperpage)
}

public goto_page=(pagenumber,current_state)=>{
    return this.get_new_paginination_state(current_state.totalpages,
        current_state.pagingwindowsize,
        pagenumber,
        pagenumber==1,
        pagenumber==current_state.totalpages,
        current_state.total_records,
        current_state.records_perpage)
}

public move_forward=(_current_state)=>{    
    return this.goto_page(Math.min(_current_state.active_page+1,_current_state.totalpages),_current_state)
}

public move_backward=(_current_state)=>{
    return this.goto_page(Math.max(_current_state.active_page-1,1),_current_state)
}
//=======================

}
export class FilterEngine{

    
//------------ PURE FUNCTIONS ------------ 
/**
 * It adds unique ids to each record for filtering.
 * @param {*} dataset 
 * @returns List of records with unique ids.
 */
  preparedata = dataset => dataset.map((current,index)=>{
    current['uniqueid'] = index
    return current
})


/**
 * Filters input list as per unique id's.
 * @param {*} inputlist List of records. Eg:["Sam","Tom","Binny"]
 * @param {*} uniqueindices Set of unique ids. Eg: {1}
 * @returns Filtered list. Eg: ["Tom"]
 */
 filterhelper = (inputlist,uniqueindices)=> inputlist.filter(value=> uniqueindices.has(value.uniqueid))


/**
 *  Filters input list as per unique id's.
 * @param {*} inputlist List of records. Eg:["Sam","Tom","Binny", "Jack","Jonny"]
 * @param {*} filterkeyMapList List of unique id sets. Eg:[{1},{0},{2},{0,2}]
 * @returns Filtered list. Eg: ["Sam","Binny"]
 */
 filter_list_data=(inputlist,filterkeyMapList)=> this.filterhelper(inputlist,this.merge_filter_indices(filterkeyMapList))


/**
 * Filters input list as per id's.
 * @param {*} inputlist List of records. Eg:["Sam","Tom","Binny", "Jack","Jonny"]
 * @param {*} filteredIndeices List of ids. Eg:[1,0,2,0,2]
 * @returns Filtered list. Eg: ["Sam","Binny"]
 */
 get_data_by_indices=(inputlist,filteredIndeices)=> this.filterhelper(inputlist,new Set(filteredIndeices))



/**
 * Converts a list of columns in to a Map of Map - {column-name:Map()}.
 * @param {*} columnlist List of column names on which filtering can be performed.
 * @returns Map<column name,Map()>
 */
 create_columnMap = columnlist => columnlist.reduce((acc,current)=> {
    acc.set(current,new Map())
    return acc },new Map())


/**
 * It calculate new filter values as per record set.
 * @param {*} original_dataset Original data set
 * @param {*} filtered_indices List of ids. Eg:[1,0,2,0,2]
 * @param {*} filter_columnnames TBD
 * @param {*} columnnames List of field names from dataset which needs to be filtered.
 * @returns  Map<unique field value,Set<unique ids>()>
 */
 calculate_filter=(original_dataset,filtered_indices,columnnames=[])=>{
    let datarows= this.get_data_by_indices(original_dataset,filtered_indices)
  
   return datarows.reduce((accumlator,current)=>{
   
        for(let column of columnnames){           
            let _colmap=accumlator.get(column)
            
            let val = (_colmap.has(current[column])?_colmap.get(current[column]):new Set()).add(current.uniqueid)
            //console.log("Current > ",current[column],val)

            _colmap.set(current[column],val)
        }
        return accumlator
    }, this.create_columnMap(columnnames))
}



/**
 * Merge two sets
 * @param {*} filterkeyMapList List of filter Map. 
 * Eg: [{'Valentia' => Set { 0, 6 },'Dulcine' => Set { 1 }},{'Orlton' => Set { 0, 2, 5 },'Petruszka' => Set { 1 }}]
 * @returns A set of unique ids {0,1,2,5,6}
 */
 merge_filter_indices = filterkeyMapList=>filterkeyMapList.reduce((accum,current)=>{          
    accum = new Set([...accum,...current])
    return accum
 },new Set())




/**
 * Filter record ids as per filter.
 * @param {*} inputlist dataset records 
 * @param {*} filterkeyMapList List of filter Map. 
 * Eg: [{ 0, 6 }, { 1 }, { 0, 2, 5 },{ 1 }]
 * @returns A list of uniquie ids as per filter criteria [0,1,2,5,6]
 */
 filter_list_ids=(inputlist,filterkeyMapList)=>{    
    let uniquIndises = this.merge_filter_indices(filterkeyMapList)    
    return inputlist.reduce((accum,current)=> {
         uniquIndises.has(current) ? accum.push(current) : accum
         return accum
    },[])
   }

/**
 * Helper function to create a new filter state object. 
 * @param {*} _filterMap Last filter Map<column header, Map<unique values of column, set of associated unique ids>>. Eg: {'first_name' : { 'Valentia' :  { 0, 6 },'Dulcine' : { 1 }},'last_name' : { 'Orlton' :  { 0, 2, 5 },'Petruszka' : { 1 }}}
 * @param {*} _lastfilteredcolumn Name of a column on which latest filter is applied. Eg: last_name
 * @param {*} _lastfiltervalues List unique record ids applied on column with latest filter. Eg:[0,5,6,7]
 * @param {*} _resultset List of record ids. Eg: [0,5,6,7]
 * @returns New State object with all the above values.
 */ 
 create_new_filter_state_helper=(_filterMap,_lastfilteredcolumn=null,_lastfiltervalues=null,_resultset=null)=>{ 
    return {
        filterMap:_filterMap,
        lastfilteredcolumn:_lastfilteredcolumn,
        lastfiltervalues:_lastfiltervalues,
        resultset:_resultset
    }
}

/**
 * Apply filters on record set, based on current and previous filter saved state.
 * @param {*} previous_state Last saved filter state.
 * @param {*} newFiltercolumn Name of a column on which filter tobe applied. Eg: last_name
 * @param {*} filtered_ids List unique record ids applied on column with latest filter. Eg:[{0},{5},{6},{7}]
 * @param {*} dataset_columnnames List of column names from original dataset. Eg: ['first_name','last_name','gender','company','department','language','salery']
 * @param {*} inputlist - Not used as of now
 * @returns New Filter state object
 */
 create_new_filter_state=(previous_state,newFiltercolumn,filtered_ids,dataset_columnnames,inputlist)=>{

    let new_result = [...this.filter_list_ids(previous_state.resultset,filtered_ids).values()]   
    let new_filterMap=null
    
        let intermidiateFileterMap=this.calculate_filter(inputlist,new_result,dataset_columnnames)
        new_filterMap = new Map()
        previous_state.filterMap.forEach((value, key, map)=>{
            if(newFiltercolumn == key){    
                new_filterMap.set(key,value)
            }else{
                new_filterMap.set(key,intermidiateFileterMap.get(key))
            }
        })
   
    return this.create_new_filter_state_helper(new_filterMap,newFiltercolumn,filtered_ids,new_result)
}

/**
 * Initiates a filter stack with initial state.
 * @param {*} initial_datalist List: Original dataset
 * @param {*} columnnames List of field names from dataset which needs to be filtered.
 * @returns 
 */
 create_initial_state=(initial_datalist,columnnames)=>{
    let unique_id_list= initial_datalist.map(current=>current.uniqueid)
    return [this.create_new_filter_state_helper(this.calculate_filter(initial_datalist,
                                                            unique_id_list,
                                                            columnnames),
                                                                        null,
                                                                        null,
                                                                        unique_id_list)]
}

public get_filtered_records=(original_dataset,filter_state)=> this.get_data_by_indices(original_dataset,filter_state[filter_state.length-1].resultset)

//Always return original filter list
//[...filterstate[filterstate.length-1].filterMap.entries()].map(current=> [current[0],[...current[1].keys()].join(', ')])
/**
 * 
 * @param filter_state 
 * @returns 
 */
public get_latest_filters=(filter_state,columnname)=> Array.from(filter_state[0].filterMap.get(columnname).entries()).map(current=>current[0])

/* ************************************* */

//------------ IMPURE FUNCTIONS ------------ 

/**
 * Print latest records as per applied filters.
 * @param {*} originallist Original dataset
 * @param {*} filterstate Saved Filter state.
 */
 /*print_latest_state=(originallist,filterstate)=>{
    //console.log("STATE:",filterstate)
    console.log("\n\n************ RECORDS *************")
    console.table(get_data_by_indices(originallist,filterstate[filterstate.length-1].resultset))
    console.log("\n\n************ FILTERS *************")
    console.table([...filterstate[filterstate.length-1].filterMap.entries()].map(current=> [current[0],[...current[1].keys()].join(', ')]))

    
}*/

/**
 * Update filter state as per new filter criteria and previous filter state.
 * @param {*} filter_state Entire filter state STACK.
 * @param {*} newfiltercolumn Name of a column on which filter tobe applied. Eg: last_name
 * @param {*} newfiltervaluelist List of unique values selected by user for particulat column. Eg:['Valentia', 'Orlton']
 * @param {*} dataset_columnnames List of column names from original dataset. Eg: ['first_name','last_name','gender','company','department','language','salery']
 * @param {*} inputlist Original dataset
 */
 update_filter_state=(filter_state,newfiltercolumn,newfiltervaluelist,dataset_columnnames,inputlist)=>{
  
    let previous_state = filter_state[filter_state.length-1]

    /*
     If current filter and last used filter column are same- merge both the filter values before passing to filter record.
    */
    if(previous_state.lastfilteredcolumn && newfiltercolumn == previous_state.lastfilteredcolumn){
        filter_state.pop()
        previous_state = filter_state[filter_state.length-1]               
        let uniqueIds=newfiltervaluelist.map(current=>previous_state.filterMap.get(newfiltercolumn).get(current))

        filter_state.push(this.create_new_filter_state(previous_state,
            newfiltercolumn,
            uniqueIds,
            dataset_columnnames,
            inputlist))
    }
    else{
        let uniqueIds=newfiltervaluelist.map(current=>previous_state.filterMap.get(newfiltercolumn).get(current))
        filter_state.push(this.create_new_filter_state(previous_state,
            newfiltercolumn,
            uniqueIds,
            dataset_columnnames,
            inputlist))
        
    }
  
}

/**
 * Clear last applied filter on dataset.
 * @param {*} filter_state 
 * @returns 
 */
 clear_last_filter=filter_state=>filter_state.pop()

 /* not needed for Angular
 readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })*/



 /*ask_user=(initial_datalist,filterstate=[],dataset_columnnames)=>{
    console.log("*****************************************************************************************************************")
    print_latest_state(initial_datalist,filterstate)    
    readline.question(`What filter you want to apply?`, multi => {
        
        if(multi[0] == 'N'){
            console.log('EXIT')
            readline.close()
        }else{

            let userinput= multi.split(" ")
            if(userinput[0]=='clear'){
                filterstate.length>1?clear_last_filter(filterstate):null
            }else{
                update_filter_state(filterstate,userinput[0],userinput.slice(1),dataset_columnnames,initial_datalist)
            }
            
            ask_user(initial_datalist,filterstate,dataset_columnnames)
        }
      })
  }*/


  /**
   * Initialize a filter engine.
   * @param {*} initial_datalist Original datalist
   * @param {*} columnnames List of column names from original dataset. Eg: ['first_name','last_name','gender','company','department','language','salery']
   */
 public init=(initial_datalist,columnnames)=>{
 return this.create_initial_state(this.preparedata(initial_datalist),columnnames)
  //ask_user(initial_datalist,filter_state,columnnames)
}
/* ************************************* */
}


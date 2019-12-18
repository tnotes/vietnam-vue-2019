import axios from 'axios';
import url from './url';
let dynamicSort = function(property){
  let sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
};
const state = {
  ec_list: [
  {value:'lazada',color:'orange darken-4'},
  {value:'tiki',color:'light-blue lighten-1'},
  {value:'sendo',color:'pink'},
  {value:'shopee',color:'amber darken-4'}
  ],
  history:[],
  loadPage:false,
  modes:{
   level:null,
   brand:null,
   from:null
 },
 keysearch:null,
 loadPage:false,
 scan_loading:false,
 load_pagination:false,
 keyword_count:0,
 number_keyword_left:0,
 add_cookie:false,
 levels:[],
 brands:[]
};
const getters = {
  data(state,getters,rootState){ 
    return state.history.map(e=>{
      let result = {...e,...e.data};
      delete result.data;
      return result;
    })
  }
};


const actions = {
  'initialize':async function({state,dispatch}){
    await Promise.all([dispatch('get-data-scan'),dispatch('getLevelBrand'),dispatch('shop/get-shop',null,{root:true}),dispatch('get-pagination'),dispatch('get-number-keyword-left')])
  },
  refresh:async function({state,dispatch}){
    await dispatch('get-data-scan');
    await dispatch('get-pagination')
    await dispatch('get-number-keyword-left');
    await dispatch('get-keyword-scan')
  },
  'get-data-scan':async function({state},pagination = 1){
    
    state.history = [];
    state.load_pagination = true;
    let where = {
      key:{contains:''}
    };
    if(state.keysearch) {
      where.key.contains = state.keysearch;
    }else{
      delete where.key;
    };
    if(state.modes.level) where.level = state.modes.level;
    if(state.modes.brand) where.brand = state.modes.brand;
    let {data} = await axios({
      url:url+'/keyword',
      method:'GET',
      withCredentials:true,
      params:{
        limit:10,
        skip:(pagination-1)*10,
        where:JSON.stringify(where)
      }
    });
   
    state.history = data;
    state.load_pagination = false;
  },
  'get-pagination':async function({state}){
    let where = {
      key:{contains:''},
      'get-count':'true',
    };
    if(state.keysearch) {
      where.key.contains = state.keysearch;
    }else{
      delete where.key;
    };
    if(state.modes.level) where.level = state.modes.level;
    if(state.modes.brand) where.brand = state.modes.brand;
    let {data} = await axios({
      url:url+'/keyword',
      method:'GET',
      params:{
        'get-count':'true',
        where:JSON.stringify(where)
      },
      withCredentials:true
    });
    state.keyword_count = parseInt(data)
  },
  'get-number-keyword-left':async function({state}){
    let where = {
      key:{contains:''},
      status:false
    };
    if(state.keysearch) {
      where.key.contains = state.keysearch;
    }else{
      delete where.key;
    };
    if(state.modes.level) where.level = state.modes.level;
    if(state.modes.brand) where.brand = state.modes.brand;
    let {data} = await axios({
      url:url+'/keyword',
      method:'GET',
      params:{
        'get-count':'true',
        where:JSON.stringify(where)
      },
      withCredentials:true
    })
    state.number_keyword_left = parseInt(data);
  },
  'get-keyword-scan':async function({state}){

    let where = {
      key:{contains:''},
      status:false
    };
    if(state.keysearch) {
      where.key.contains = state.keysearch;
    }else{
      delete where.key;
    };
    if(state.modes.level) where.level = state.modes.level;
    if(state.modes.brand) where.brand = state.modes.brand;
    let {data} = await axios({
      url:url+'/keyword',
      method:'GET',
      withCredentials:true,
      params:{
        limit:10000000000000,
        where:JSON.stringify(where)
      }
    })
    return data;
  },
  add_cookie_import:async function({state,dispatch},cookie){
    await axios({
      url:url+'/cookie',
      method:'POST',
      withCredentials:true,
      data:{
        ecom_name:'lazada',
        cookie
      }
    });
    state.add_cookie = false;
    return dispatch('continue_scan');
  },
  reset_scan:async function({state}){
    await axios({
      url:url+'/keyword/reset',
      method:'GET',
      withCredentials:true
    })
    state.history = state.history.map(e=>{
      e.data = [];
      e.status = false;
      return e;
    })
  },
  start_scan:async function({state,dispatch}){

    await dispatch('reset_scan');
    await dispatch('continue_scan');
  },
  push_history:async function({state},item){
    state.number_keyword_left-=1;
    state.history = state.history.map(e=>{
      if(e.id === item.id) e = item;
      return e;
    })
  },
  continue_scan:async function({state,dispatch}){
    state.scan_loading = true;
    let keywords = await dispatch('get-keyword-scan');
    try{
      for(let {id} of keywords){
        if(!state.scan_loading) break;
      let {data} = await axios.post(url+'/keyword/scan',{keyId:id},{withCredentials:true});
      dispatch('push_history',data[0])
    }
    }catch(e){
      console.log(e.response.code);
      state.add_cookie = true;
    }
  },
  stop_scan:async function({state}){
    state.scan_loading = false;
  },

  updateLevel:async function({state,dispatch},level){

    state.modes.level = level;
    await dispatch('refresh');
  },
  updateBrand:async function({state,dispatch},brand){
    state.modes.brand = brand;
    await dispatch('refresh');
  },
  removeLevel:async function({state,dispatch},level){
    state.modes.level = null;
    await dispatch('refresh');
  },
  removeBrand:async function({state,dispatch},brand){
    state.modes.brand = null;
    await dispatch('refresh');
  },
  getLevelBrand:async function({state}){
    let {data} = await axios.get(url+'/keyword?select=level,brand&limit=100000000',{withCredentials:true});
    state.levels = [...new Set(data.map(({level})=>level))];
    state.brands = [...new Set(data.map(({brand})=>brand))];
  },
  searchItem:async function({state,dispatch},keysearch){
    state.keysearch = keysearch;
    dispatch('refresh');
    
  }

};

const mutations = {

};

export const scan = {
  namespaced: true,
  getters,
  mutations,
  state,
  actions
};

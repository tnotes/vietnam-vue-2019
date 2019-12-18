import axios from 'axios';
import url from './url';
const state = {
  keyword:[],
  keyword_pagination:[]
};

const actions = {
  'get-keyword':async function({state}){
    if(state.loadPage) return;
    let options = {
      url:url+'/keyword?limit=1000000000000',
      method:'get',
      withCredentials:true
    };
    let {data} = await axios(options);
    state.loadPage = true;
    state.keyword = data;
  },
  'get-keyword-pagination':async function({state},pagination = 1){
    if(state.loadPage) return;
    let options = {
      url:url+'/keyword?limit=10&skip='+(pagination-1)*10,
      method:'get',
      withCredentials:true
    };
    let {data} = await axios(options);
    state.loadPage = true;
    state.keyword_pagination = data;
  },
  'update-keyword':async function({state},obj){
    let options = {
      url:url+'/keyword/'+obj.id,
      method:'patch',
      withCredentials:true,
      data:obj
    };
    let response = await axios(options);
    

  },
  'push-keyword':async function({state},obj){
    let options = {
      url:url+'/keyword',
      method:'post',
      withCredentials:true,
      data:obj
    };
    let {data} = await axios(options);

    state.keyword.push(data);

  },
  'remove-keyword':async function({state},obj){
    let options = {
      url:url+'/keyword/'+obj.id,
      method:'delete',
      withCredentials:true,
      data:obj
    };
    let {data} = await axios(options);
    state.keyword = state.keyword.filter(({id})=>obj.id !== id)
  },
  'set-keyword-scan':function({state},keywords){

    state.keyword_scan = keywords;
  }

};

const mutations = {
  setKeywordScan:(state)=>keyword=>{
    state.keyword_scan = keyword;
  }
};

export const keyword = {
  namespaced: true,
  state,
  actions,
  mutations
};

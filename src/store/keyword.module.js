import axios from 'axios';
import url from './url';
const state = {
  keyword:[],
  keyword_scan:[],
  loadPage:false
};

const actions = {

  'get-keyword':async function({state}){
    if(state.loadPage) return;
    let options = {
      url:url+'/keyword?limit=100000000',
      method:'get',
      withCredentials:true
    };
    let {data} = await axios(options);
    state.loadPage = true;
    state.keyword = data;
    state.keyword_scan = data;
  },
  'update-keyword':async function({state},obj){
    let options = {
      url:url+'/keyword/'+obj.id,
      method:'patch',
      withCredentials:true,
      data:obj
    };
    let response = await axios(options);
    console.log(response);

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

};

export const keyword = {
  namespaced: true,
  state,
  actions,
  mutations
};

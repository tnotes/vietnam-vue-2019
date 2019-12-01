import axios from 'axios';
import url from './url';
const state = {
  keyword:[]
};

const actions = {
  'get-keyword':async function({state}){
    let options = {
      url:url+'/keyword',
      method:'get',
      withCredentials:true
    };
    let {data} = await axios(options);
    return this.keyword = data;
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
    let response = await axios(options);

  },
  'remove-keyword':async function({state},obj){
    let options = {
      url:url+'/keyword/'+obj.id,
      method:'delete',
      withCredentials:true,
      data:obj
    };
    let response = await axios(options);
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

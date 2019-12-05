import axios from 'axios';
import url from './url';
const state = {

	history:[],
    modes:{
     level:null,
     brand:null,
     from:null
 },
 loadPage:false,
 loading_scan:false
};

const actions = {
    get_keyword_member:async function(context,id){
        let {data} = await axios.post(url+'/share/get-keyword',{id},{withCredentials:true});
        return data;
    }, 
    'reset-history':async function({state}){
        try{
            let {data} = await axios.delete(url+'/scan',{withCredentials:true});
        }catch(e){

        }
        return state.history = [];

    },
    'get-history-scan':async function({state}){
        let {data} = await axios.get(url+'/scan',{withCredentials:true});
        return state.history = data;

    },
    'set-data-scan':async function({dispatch}){
        return await Promise.all([dispatch('get-history-scan'),dispatch('shop/get-shop',{},{root:true}),dispatch('keyword/get-keyword',{},{root:true}),dispatch('share/get-member',{},{root:true})])
    },
    'scan-keyword':async function({state},keyId){
        state.loading_scan = true;
        let {data} = await axios.post(url+'/scan',{keyId},{withCredentials:true});
        state.history.push(data);
    }

};



export const scan = {
    namespaced: true,
    state,
    actions
};

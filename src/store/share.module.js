import axios from 'axios';
import url from './url';
const state = {
    items:[],
    error:'asdfdfdff'
};

const actions = {
    'get-member':async function({commit,state}){
        let {data} = await axios.get(url+'/share',{withCredentials:true});
        return state.items = data;
    },
    'remove-member':async function(context,id){
        let {data} = await axios.delete(url+'/share/'+id,{withCredentials:true});
        return state.items = state.items.filter((data=>data.id !== id));
    },
    'add-member':async function(context,email_invite){
        let {data} = await axios.post(url+'/share/',{email_invite},{withCredentials:true});
        return state.items.push(data);
    },
    'reset-error':function({state}){
        state.error = '';
    }
};

const mutations = {

};

export const share = {
    namespaced: true,
    state,
    actions,
    mutations
};

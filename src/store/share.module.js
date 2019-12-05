import axios from 'axios';
import url from './url';
const state = {
    members:[],
    waiters:[],
    invite:[],
    error:'',
    dialog_shop:false,
    loadPage:false
};

const actions = {
    
    'get-member':async function({commit,state}){
        if(state.loadPage) return;
        let {data} = await axios.get(url+'/share',{withCredentials:true});
        return state.members = data.filter(({status_invite})=>status_invite);
    },
    'get-request-member':async function({commit,state}){
        let {data} = await axios.get(url+'/share',{withCredentials:true});

        return state.waiters = data.filter(({status_invite})=>!status_invite);
    },
    'get-invite-member':async function({commit,state}){
        let {data} = await axios.get(url+'/share/invite',{withCredentials:true});
        return state.invite = data;
    },
    'remove-member':async function({commit},{id,email_invite}){
        await axios.post(url+'/share/delete',{email:email_invite},{withCredentials:true});
        return commit('remove-member',id);
    },
    'add-member':async function({state},email_invite){
        let {data} = await axios.post(url+'/share/add',{email_invite},{withCredentials:true});
        return state.waiters.push(data);
    },
    'reset-error':function({state}){
        return state.error = '';
    },
    'verify-member':async function({commit,state},{id,email_from}){
        let {data} = await axios.post(url+'/share/verify',{id,email_from},{withCredentials:true});
        return state.invite = state.invite.filter(e=>e.id !== id)
    },

    'send-keyword':async function({state},{key_share,members}){
        for(let id_invite of members){
            await axios.post(url+'/share/send-keyword',{id_invite,key_share},{withCredentials:true})
        }
    }
};

const mutations = {
    'remove-member':function(state,id){
        state.members = state.members.filter((data=>data.id !== id));
        state.waiters = state.waiters.filter((data=>data.id !== id));
        state.invite = state.invite.filter((data=>data.id !== id));
    }
};

export const share = {
    namespaced: true,
    state,
    actions,
    mutations
};

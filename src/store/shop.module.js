import axios from 'axios';
import url from './url';
const state = {
    shops:[],
    competitors:[],
    loadPage:false
};

const actions = {
    'get-shop':async function({state}){
        if(state.loadPage) return;
        let {data} = await axios.get(url+'/shop',{withCredentials:true})
        state.shops = data.filter(({type})=>type);
        state.competitors = data.filter(({type})=>!type);
        state.loadPage = true;
        return true;

    },
    'add-shop':async function({state},body){

        let {data} = await axios.post(url+'/shop',{url:body.url,type:body.type},{withCredentials:true});

        if(body.type) {
            state.shops.push(data);
        }else{
            state.competitors.push(data);
        }
        return true;
    },
    'delete-shop':async function({state},body){
        await axios.delete(url+'/shop/'+body.id,{withCredentials:true})
        state.shops = state.shops.filter(e=>e.id !== body.id);
        state.competitors = state.competitors.filter(e=>e.id !== body.id);
        return true;
    }

};

const mutations = {

};

export const shop = {
    namespaced: true,
    state,
    actions,
    mutations
};

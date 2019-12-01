import Vue from 'vue';
import Vuex from 'vuex';

import { keyword } from './keyword.module';
import { share } from './share.module';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        keyword,
        share
    }
});

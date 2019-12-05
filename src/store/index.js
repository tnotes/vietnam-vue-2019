import Vue from 'vue';
import Vuex from 'vuex';

import { keyword } from './keyword.module';
import { share } from './share.module';
import { shop } from './shop.module';
import { scan } from './scan.module';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        scan,
        keyword,
        share,
        shop
    }
});

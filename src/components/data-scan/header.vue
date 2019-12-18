<template>
    <v-toolbar dense>
        <v-btn @click="start_scan" v-if="!scan_loading" class="mx-1" color="primary">Quét mới</v-btn>
        <v-btn @click="stop_scan" v-if="scan_loading" class="mx-1" color="primary">Dừng Lại</v-btn>
        <v-btn @click="continue_scan" class="mx-2" color="orange lighten-5">Tiếp Tục</v-btn>
        <img class="mx-2" v-if="scan_loading" src="/loading.svg"> 
        <template v-if="$vuetify.breakpoint.mdAndUp">

            <v-spacer></v-spacer>
            <v-chip label color="warning" class="mx-4" dark outlined> <v-icon small class="mx-2">mdi-arrow-down-bold</v-icon> {{number_keyword_left}} key </v-chip>
            <v-chip
            v-for="type of Object.keys(modes)"
            v-if="modes[type]"
            class="ma-2"
            close
            label
            @click:close="remove(type)"
            >

            {{type}}: {{modes[type]}}
        </v-chip>


        <v-divider vertical></v-divider>

        <v-btn-toggle
        color="primary"
        dense
        group
        >
        

    </v-btn-toggle>


    <v-divider vertical></v-divider>
    <div class="mx-4"></div>
    <v-menu offset-y>
        <template v-slot:activator="{ on }">

            <v-btn :color="modes.level?'warning':''" v-on="on" :value="1" text>
                <v-icon>mdi-numeric</v-icon>
            </v-btn>

        </template>
        <v-list>
            <v-list-item
            v-for="(item, index) in levels"
            :key="index"
            @click="updateLevel(item)"
            >
            <v-list-item-title>{{ item }}</v-list-item-title>
        </v-list-item>
    </v-list>

</v-menu>
<v-menu offset-y>
    <template v-slot:activator="{ on }">

        <v-btn :color="modes.brand?'warning':''" v-on="on" :value="1" text>
            <v-icon>mdi-umbrella</v-icon>
        </v-btn>

    </template>
    <v-list>
        <v-list-item
        v-for="(item, index) in brands"
        :key="index"
        @click="updateBrand(item)"
        >
        <v-list-item-title>{{ item }}</v-list-item-title>
    </v-list-item>
</v-list>

</v-menu>
<v-menu offset-y>
    <template v-slot:activator="{ on }">

        <v-btn :color="modes.from?'warning':''" v-on="on" :value="1" text>
            <v-icon>mdi-recycle</v-icon>
        </v-btn>

    </template>
    <v-list>
        <v-list-item
        v-for="(item, index) in member"
        :key="index"
        @click="active_share(item)"
        >
        <v-list-item-title>{{ item.name_invite }}</v-list-item-title>
    </v-list-item>
</v-list>

</v-menu>

</template>

<v-dialog v-model="add_cookie" max-width="400px">

    <v-card>
        <v-card-title>
            <span class="headline">Lazada Capcha</span>

        </v-card-title>

        <v-card-text>
         <p class="font-weight-regular">Vui lòng truy cập vào <a target="_blank" href="https://www.lazada.vn/catalog/?q=microlab&_keyori=ss&from=input&spm=a2o4n.home.search.go.19056afe5qDsgd">đây</a> để vượt capcha,sau đó lấy cookie bằng tiện ích <a href="https://chrome.google.com/webstore/detail/get-cookie-for-fplus/embffhododclmgpnabmjmgoekpnoboic" target="_blank">Get Cookie For FPlus</a>.</p>
         <v-container>
            <v-row>
                <v-col cols="12" sm="6" md="12">
                    <v-text-field spellcheck="false" v-model="cookie"
                    label="Nhập cookie tại đây để tiếp tục"></v-text-field>
                </v-col>


            </v-row>
        </v-container>
    </v-card-text>

    <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="blue darken-1" text @click="add_cookie_action">Pass</v-btn>
    </v-card-actions>
</v-card>
</v-dialog>

</v-toolbar>

</template>

<script>
    import {mapState,mapActions,mapMutations,mapGetters} from "vuex";
    import axios from 'axios';

    export default {
        data () {
            return {
                cookie:'',                
                items:[],
                keyword_member:[],
                keyword_share_status:false
            }
        },
        
        computed:{
            ...mapState('keyword',
                ['keyword']
                ),
            ...mapState('share',
                ['members']
                ),
            ...mapState('scan',
                ['modes','history','scan_loading','number_keyword_left','add_cookie','levels','brands']
                ),
            
            member(){
                return this.members.map(({name_invite,id})=>({id,name_invite}));
            },
            history_scan(){
                let ids = this.keyword.map(({id})=>id);
                return this.history.filter(({keyId})=>ids.includes(keyId))
            }
            
        },
        
        methods:{
            add_cookie_action:async function(){
                await this.add_cookie_import(this.cookie);
                this.cookie = '';
                

            },

            ...mapActions('scan',['updateLevel','updateBrand','removeLevel','removeBrand','start_scan','continue_scan','stop_scan','add_cookie_import']),
           
            remove (type) {
                if(type === 'level') this.removeLevel();
                if(type === 'brand') this.removeBrand();
                if(type === 'from') {
                    this.keyword_member = [];
                    this.keyword_share_status = false;
                };
               
            },
            
            
            active_share:async function(share){
                this.keyword_share_status = true;
                this.keyword_member = await this.get_keyword_member(share.id);
                this.modes.from = share.name_invite;
                this.filter_keyword();
            }
        }
    }
</script>

<style scoped>

</style>

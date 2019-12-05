<template>
    <v-toolbar dense>
        <v-btn @click="start"  color="primary">{{text_start}}</v-btn>
        <v-btn @click="reset" class="mx-2" color="red lighten-5">Reset</v-btn>
        <template v-if="$vuetify.breakpoint.mdAndUp">

            <v-spacer></v-spacer>
            <v-chip label color="warning" class="mx-4" dark outlined> <v-icon small class="mx-2">mdi-hand-pointing-right</v-icon> {{history_scan.length}} / {{keyword_scan.length}} kết quả </v-chip>
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
            v-for="(item, index) in level"
            :key="index"
            @click="active_level(item)"
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
        v-for="(item, index) in brand"
        :key="index"
        @click="active_brand(item)"
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
</v-toolbar>
</template>

<script>
    import {mapState,mapActions} from "vuex";
    import axios from 'axios';

    export default {
        data () {
            return {
                text_start:'Bắt Đầu',
                start_status:false,
                list_mode:['level','brand','share'],
                chips: ['Programming', 'Playing video games', 'Watching movies', 'Sleeping'],
                items:[],
                keyword_member:[],
                keyword_share_status:false
            }
        },
        
        computed:{
            ...mapState('keyword',
                ['keyword','keyword_scan']
                ),
            ...mapState('share',
                ['members']
                ),
            ...mapState('scan',
                ['modes','history']
                ),
            level(){
                return [...new Set(this.keyword.map(({level})=>level))];

            },
            brand(){
                return  [...new Set(this.keyword.map(({brand})=>brand))].filter(e=>e);
            },
            member(){
                return this.members.map(({name_invite,id})=>({id,name_invite}));
            },
            history_scan(){
                let ids = this.keyword_scan.map(({id})=>id);
                return this.history.filter(({keyId})=>ids.includes(keyId))
            }
            
        },
        
        methods:{

            ...mapActions('scan',[
                'get_keyword_member'
                ]),

            filter_keyword(){
                let keyword = this.keyword;
                let {level,brand,from} = this.modes;
                if(this.keyword_share_status) keyword = this.keyword_member;
                if(level) keyword = keyword.filter(e=>e.level === level);
                if(brand) keyword = keyword.filter(e=>e.brand === brand);
                this.$store.dispatch('keyword/set-keyword-scan',keyword);
            
            },
            remove (type) {
                this.modes[type] = null;
                if(type === 'from') {
                    this.keyword_member = [];
                    this.keyword_share_status = false;
                };
                this.filter_keyword();
            },
            reset:async function(){
                return await this.$store.dispatch('scan/reset-history')
            },
            updateStatus(){
                if(!this.start_status) this.reset();
                this.text_start = this.start_status? 'Bắt Đầu':'Tạm Dừng';
                this.start_status = !this.start_status;
            },
            start:async function(){
                this.updateStatus();

                for(let {id} of this.keyword_scan){
                   await this.$store.dispatch('scan/scan-keyword',id);
                   if(!this.start_status) break;
                }


           },
           active_level(level){
                this.modes.level = level;
                this.filter_keyword();
           },
           active_brand(brand){
                this.modes.brand = brand;
                this.filter_keyword();
           },
           active_share:async function(share){
                this.keyword_share_status = true;
                this.keyword_member = await this.get_keyword_member(share.id);
                this.modes.from = share.name_invite;
                this.filter_keyword();
           },
           
           continue:async function(){

           }
    }
}
</script>

<style scoped>

</style>

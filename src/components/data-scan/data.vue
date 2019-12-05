<template>
    <div>
        <v-data-table :headers="headers" :items="desserts" class="elevation-1 my-2" loading="false" loading-text="Chưa có lịch sử dữ liệu">
            <template v-for="ecom of ec_list"  v-slot:[`item.${ecom}`]="{ item }">
                    <v-menu v-for="({type,text}) of price_obj"  max-height="200px"  transition="slide-x-transition">
                        <template v-slot:activator="{ on: menu }">
                            <v-tooltip :color="getColor(ecom)" left>
                                <template v-slot:activator="{ on: tooltip }">
                                     <div class="my-3" >

                                         <v-btn v-on="{...tooltip,...menu}" target="_blank" :outlined="type !== 1" dark small :color="getColor(ecom)">{{Price(item,type,ecom)}}</v-btn>
                                     </div>
                                </template>
                                <span>{{Name(item,type,ecom)}}</span>
                            </v-tooltip>
                        </template>
                        <v-system-bar fixed app :color="getColor(ecom)" dark >
                            <v-spacer></v-spacer>
                            <span style="color:white">{{text}}</span>
                            <v-spacer></v-spacer>
                        </v-system-bar>
                        <v-list>
                            <div class="my-6" >
                            <v-list-item v-for="(product,index) in Get_Price_Object(item,type,ecom)" :key="index" target="_blank">
                                <v-tooltip :color="getColor(ecom)" left>
                                    <template v-slot:activator="{ on: tooltip_price }">
                                        <v-list-item-title :href="product.link" v-on="{...tooltip_price,...menu}">
                                            <v-chip class="ma-1" outlined  small label>
                                                {{(index+1)}}
                                            </v-chip>
                                            <v-chip :href="product.link" target="_blank" class="ma-1" dark :color="getColor(ecom)" small label>
                                            {{ product.price.toLocaleString() }}
                                            </v-chip>
                                            <v-icon :color="getColor(ecom)" v-if="shopKeys.includes(product.shopKey)">{{shopKeys_shops.includes(product.shopKey)?'mdi-home':'mdi-walk'}}</v-icon>
                                        </v-list-item-title>

                                    </template>
                                    <span>{{product.shopName}}</span>
                                </v-tooltip>
                            </v-list-item>
                            </div>
                        </v-list>
                    </v-menu>
            </template>

        </v-data-table>
    </div>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        data: () => ({
            menu:false,
            price_obj:[
                {
                    text:'Giá nhỏ nhất',
                    type:1
                },
                {
                    text:'Giá Shop',
                    type:2
                }
            ],
            ec_list: ['tiki', 'lazada', 'sendo', 'shopee', 'adayroi'],
            headers: [
                {
                    text: 'Từ khóa',
                    align: 'left',
                    sortable: false,
                    value: 'key',
                },
                {text: 'Lazada', value: 'lazada'},
                {text: 'Tiki', value: 'tiki'},
                {text: 'Shopee', value: 'shopee'},
                {text: 'Sendo', value: 'sendo'},
                {text: 'Adayroi', value: 'adayroi'},
                {text: 'Tồn Kho', value: 'stock'},
            ],
        }),
        computed: {
            ...mapState('shop',
                ['shops', 'competitors']
            ),
            ...mapState('keyword',
                ['keyword','keyword_scan']
            ),
            
            desserts() {
                let _ = this;
                let id_scan = this.keyword_scan.map(({id})=>id);
            
                return _.keyword.map(({key, id,stock}) => {
                    let data = _.get_price(id);
                    if (data) data.stock = stock,data.keyId = id;
                    if(data) {
                        return {key, ...data}
                    }else{
                        return null
                    }
                }).filter(e=>{

                    if(e) {
    
                        return id_scan.includes(e.keyId)
                    }
                });
            },
            shopKeys(){

                return this.shops.concat( this.competitors).map(({shopKey})=>shopKey);
            },
            shopKeys_shops(){
                return this.shops.map(({shopKey})=>shopKey);

            }

        },
        created() {
            return this.initialize();
        },
        methods: {
            /**
             * @return {string}
             */
            Name(item,type,ecom){


                if(type === 1){
                    return (item[ecom].length > 0) ? item[ecom][0].shopName:'';
                }else if(type === 2){
                    let items = this.Shops_object(item[ecom]);
                    return (items.length > 0) ? items[0].shopName:'';

                }else if(type === 3){
                    let items = this.Competitors_object(item[ecom]);
                    return (items.length > 0) ? items[0].shopName:'';

                }
            },
            /**
             * @return {string}
             */
            Price(item,type,ecom){
                if(type === 1){
                    return (item[ecom].length > 0) ? item[ecom][0].price.toLocaleString():'';
                }else if(type === 2){
                    let items = this.Shops_object(item[ecom]);
                    return (items.length > 0) ? items[0].price.toLocaleString():'';

                }else if(type === 3){
                    let items = this.Competitors_object(item[ecom]);
                    return (items.length > 0) ? items[0].price.toLocaleString():'';

                }
            },
            Shops_object(data){
                return this.shops.map(({shopKey,shop_name})=>{
                    let element = data.find(e=>e.shopKey.toString() === shopKey.toString());
                    if(element) element.shopName = shop_name;
                    return element;
                }).filter(e=>e);
            },
            Competitors_object(data){
                return this.competitors.map(({shopKey,shop_name})=>{
                    let element = data.find(e=>e.shopKey.toString() === shopKey.toString());
                    if(element) element.shopName = shop_name;
                    return element;
                }).filter(e=>e);
            },
            Get_Price_Object(item,type,ecom){
                if(type === 1){
                    return item[ecom];
                }else if(type === 2){
                    return this.Shops_object(item[ecom])
                }
            },
            get_price(id) {
                let _ = this;
                let result = _.$store.state.scan.history.find(({keyId}) => keyId === id);
                if (!result) return null;
                for(let ec of _.ec_list){
                    result[ec] = result.data[ec].sort(_.dynamicSort('price'));
                }
                return result;

            },
            dynamicSort: function (property) {
                let sortOrder = 1;
                if (property[0] === "-") {
                    sortOrder = -1;
                    property = property.substr(1);
                }
                return function (a, b) {
                    let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                    return result * sortOrder;
                }
            },
            initialize() {
                return this.$store.dispatch('scan/set-data-scan')
            },
            getColor(ec) {
                if (ec === 'lazada') return 'orange darken-4'
                if (ec === 'tiki') return 'light-blue lighten-1'
                if (ec === 'shopee') return 'amber darken-4';
                if (ec === 'sendo') return 'pink';
                if (ec === 'adayroi') return 'pink accent-3';

            }
        }
    }
</script>

<style scoped>

</style>

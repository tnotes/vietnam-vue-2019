<template>
    <v-card>
        <v-card-title>
          <v-text-field v-model="keysearch" @keyup.13="search" append-icon="mdi-search" label="Nhập tên sản phẩm"></v-text-field>
      </v-card-title>
      <v-spacer></v-spacer>

      <v-pagination v-model="pagination.page" :length="Math.ceil(keyword_count/10)" :total-visible="8" ></v-pagination>
      


      <v-data-table loading-text="Đang tải dữ liệu" hide-default-footer :headers="headers" :items="data" class="elevation-1 my-2" :loading="load_pagination">

        <template v-for="({value}) of ec_list" v-slot:[`item.${value}`]="{ item }">

            <div v-if="item.status">
                <v-menu v-for="({type,text}) of price_obj"  max-height="200px"  transition="slide-x-transition">

                    <template v-slot:activator="{ on: menu }">
                        <v-tooltip :color="getColor(value)" left>
                            <template v-slot:activator="{ on: tooltip }">
                             <div class="my-3" >

                                 <v-btn v-on="{...tooltip,...menu}" target="_blank" :outlined="type !== 1" dark small :color="getColor(value)">{{Price(item,type,value)}}</v-btn>
                             </div>
                         </template>
                         <span>{{Name(item,type,value)}}</span>
                     </v-tooltip>
                 </template>
                 <v-system-bar fixed app :color="getColor(value)" dark >
                    <v-spacer></v-spacer>
                    <span style="color:white">{{text}}</span>
                    <v-spacer></v-spacer>
                </v-system-bar>
                <v-list>
                    <div class="my-6" >
                        <v-list-item v-for="(product,index) in Get_Price_Object(item,type,value)" :key="index" target="_blank">
                            <v-tooltip :color="getColor(value)" left>
                                <template v-slot:activator="{ on: tooltip_price }">
                                    <v-list-item-title :href="product.link" v-on="{...tooltip_price,...menu}">
                                        <v-chip class="ma-1" outlined  small label>
                                            {{(index+1)}}
                                        </v-chip>
                                        <v-chip :href="product.link" target="_blank" class="ma-1" dark :color="getColor(value)" small label>
                                            {{ product.price.toLocaleString() }}
                                        </v-chip>
                                        <v-icon :color="getColor(value)" v-if="shopKeys.includes(product.shopKey)">{{shopKeys_shops.includes(product.shopKey)?'mdi-home':'mdi-walk'}}</v-icon>
                                    </v-list-item-title>

                                </template>
                                <span>{{product.shopName}}</span>
                            </v-tooltip>
                        </v-list-item>
                    </div>
                </v-list>
            </v-menu>
        </div>
    </template>

</v-data-table>
</v-card>
</template>

<script>
    import {mapState,mapGetters,mapActions} from 'vuex';

    export default {
        data: () => ({
            pagination: {
                page: 1,
                pages: 15,
                limit: 8
            },
            menu: false,
            keysearch: '',
            price_obj: [
            {
                text: 'Giá nhỏ nhất',
                type: 1
            },
            {
                text: 'Giá Shop',
                type: 2
            }
            ],
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
          
            {text: 'Tồn Kho', value: 'stock'},
            ],
        }),
        computed: {
            ...mapGetters('scan', ['data']),
            ...mapState('shop',
                ['shops', 'competitors']
                ),
            ...mapState('keyword',
                ['keyword']
                ),
            ...mapState('scan',
                ['scan_loading','keyword_count', 'history', 'load_pagination', 'ec_list']
                ),

            
            shopKeys() {

                return this.shops.concat(this.competitors).map(({shopKey}) => shopKey);
            },
            shopKeys_shops() {
                return this.shops.map(({shopKey}) => shopKey);

            }


        },

        created() {
            this.$store.dispatch('scan/initialize');
        },
        watch: {
            "pagination.page": {
                handler: function (page) {

                    this.$store.dispatch('scan/get-data-scan', page)
                },
                deep: true
            }

        },

        methods: {
            ...mapActions('scan',[
                'searchItem'
                ]),
            
            /**
             * @return {string}
             */
             Name(item, type, ecom) {

                if (type === 1) {
                    return (item[ecom].length > 0) ? item[ecom][0].shopName : '';
                } else if (type === 2) {
                    let items = this.Shops_object(item[ecom]);
                    return (items.length > 0) ? items[0].shopName : '';

                } else if (type === 3) {
                    let items = this.Competitors_object(item[ecom]);
                    return (items.length > 0) ? items[0].shopName : '';

                }
            },
            /**
             * @return {string}
             */
             Price(item, type, ecom) {
                if (type === 1) {
                    return (item[ecom].length > 0) ? item[ecom][0].price.toLocaleString() : '';
                } else if (type === 2) {
                    let items = this.Shops_object(item[ecom]);
                    return (items.length > 0) ? items[0].price.toLocaleString() : '';

                } else if (type === 3) {
                    let items = this.Competitors_object(item[ecom]);
                    return (items.length > 0) ? items[0].price.toLocaleString() : '';

                }
            },
            Shops_object(data) {

                return this.shops.map(({shopKey, shop_name}) => {
                    let element = data.find(e => e.shopKey.toString() === shopKey.toString());
                    if (element) element.shopName = shop_name;
                    return element;
                }).filter(e => e);
            },
            Competitors_object(data) {
                return this.competitors.map(({shopKey, shop_name}) => {
                    let element = data.find(e => e.shopKey.toString() === shopKey.toString());
                    if (element) element.shopName = shop_name;
                    return element;
                }).filter(e => e);
            },
            Get_Price_Object(item, type, ecom) {

                if (type === 1) {
                    return item[ecom];
                } else if (type === 2) {
                    return this.Shops_object(item[ecom])
                }
            },
            
            getColor(ec) {
                return this.ec_list.find(({value}) => ec === value).color

            },
            search:async function(){
                await this.searchItem(this.keysearch)

            }
        }
    }
</script>

<style scoped>

</style>

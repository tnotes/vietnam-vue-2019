<template>
    <v-card>

        <v-data-table
                :headers="headers"
                :items="$store.state.shop.competitors"
                class="elevation-1"
                :search="search"


        >
            <template v-slot:item.ecom_name="{ item }">
                <v-chip :color="getColor(item.ecom_name)" outlined  label dark>{{ item.ecom_name.toUpperCase() }}</v-chip>
            </template>
            <template v-slot:item.shop_name="{ item }">
                <v-chip :color="getColor(item.ecom_name)" :href="item.url" target="_blank"  label dark>{{ item.shop_name }}</v-chip>
            </template>
            <template v-slot:item.action="{ item }">

                <v-icon small @click="deleteItem(item)">
                    mdi-delete
                </v-icon>
            </template>
            <template v-slot:no-data>
                <v-btn color="primary" @click="initialize">Reset</v-btn>
            </template>
        </v-data-table>
    </v-card>
</template>

<script>
    export default {
        data: () => ({
            dialog: false,
            search: '',
            headers: [
                {
                    text: 'Sàn Thương Mại',
                    align: 'left',
                    sortable: false,
                    value: 'ecom_name',
                },
                {text: 'Cửa hàng đối thủ', value: 'shop_name'},

                {text: 'Thực hiện', value: 'action', sortable: false},
            ],
        }),

        watch: {
            dialog(val) {
                val || this.close()
            },
        },

        created() {
            this.initialize()
        },

        methods: {
            initialize() {
                this.$store.dispatch('shop/get-shop')
            },
            deleteItem(item) {
                confirm('Bạn có chắc chắn muốn xóa cửa hàng này khỏi danh sách đối thủ ?') && this.$store.dispatch('shop/delete-shop', item);
            },

            close() {
                this.dialog = false
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                }, 300)
            },
            getColor(ec){
                if(ec === 'lazada') return 'orange lighten-1'
                if(ec === 'tiki') return 'light-blue lighten-1'
                if(ec === 'shopee') return 'amber darken-4';
                if(ec === 'sendo') return 'pink';
                if(ec === 'adayroi') return 'pink accent-3';

            }
        },
    }
</script>

<style scoped>

</style>

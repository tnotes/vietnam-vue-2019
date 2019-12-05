<template>
    <v-container fluid>
        <v-toolbar color="white darken-3" class="mb-1">
            <v-tabs>
                <v-tab to="/shop">Cửa Hàng</v-tab>
                <v-tab to="/shop/doi-thu">Đối Thủ</v-tab>
            </v-tabs>
            <v-divider class="mx-4" inset vertical></v-divider>

            <v-spacer></v-spacer>


            <v-dialog v-model="add" max-width="400px">
                <template v-slot:activator="{ on }">

                    <v-btn v-show="$route.path === '/shop'"  color="primary" dark class="mb-2" v-on="on">Thêm cửa hàng</v-btn>
                    <v-btn v-show="$route.path === '/shop/doi-thu'"  color="primary" dark class="mb-2" v-on="on">Thêm đối thủ</v-btn>

                </template>
                <v-card>
                    <v-card-title>
                        <span v-show="$route.path === '/shop'" class="headline">Nhập Link cửa hàng sở hữu</span>
                        <span v-show="$route.path === '/shop/doi-thu'" class="headline">Nhập Link cửa hàng đối thủ</span>
                    </v-card-title>

                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="6" md="12">
                                    <v-text-field spellcheck="false" v-model="url"
                                                  label="Nhập địa chỉ shop"></v-text-field>
                                </v-col>


                            </v-row>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="add = false">Cancel</v-btn>
                        <v-btn color="blue darken-1" v-show="!loadshow" text @click="add_shop">Submit</v-btn>
                        <v-btn color="blue darken-1" v-show="loadshow" text loading></v-btn>

                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-toolbar>
        <router-view/>
    </v-container>
</template>

<script>
    export default {
        name: "shop",
        data: () => ({
            url: '',
            add:false,
            loadshow:false

        }),
        methods: {
            reset(){
                this.url = '';
                this.add = false;
                this.loadshow = false;
            },
            add_shop: async function () {
                this.loadshow = true;
                let type = this.$route.path === '/shop';

                await this.$store.dispatch('shop/add-shop',{url:this.url,type})
                this.reset();
            }
        }
    }
</script>

<style scoped>

</style>

<template>
    <div>
        <div class="text-center ma-2">
            <v-snackbar
                    :timeout="timeout"
                    v-model="snackbar"
            >
                {{ notification }}
                <v-btn
                        color="pink"
                        text
                        @click="snackbar = false"
                >
                    Close
                </v-btn>
            </v-snackbar>
        </div>
    <v-data-table :search="search" v-model="keyword_select"  show-select :headers="headers" :items="desserts" sort-by="calories" class="elevation-1">
        <template v-slot:top>

            <v-toolbar flat color="white">

                <v-toolbar-title>Danh sách Từ khóa</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>

                <v-spacer></v-spacer>
                <div  v-if="keyword_select.length > 0">

                    <v-dialog v-model="dialog_edit" max-width="400px">
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" class=" mx-2" x-small fab dark color="primary">
                                <v-icon dark>mdi-pencil</v-icon>
                            </v-btn>

                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">Cập nhật {{keyword_select.length}} từ khóa</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>

                                        <v-col cols="12" sm="6" md="8">
                                            <v-text-field spellcheck="false" v-model="updateItem.brand" placeholder="Mặc định" label="Thương Hiệu"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field spellcheck="false" placeholder="Mặc định" v-model="updateItem.level" type="number" label="Cấp độ"></v-text-field>
                                        </v-col>
                                    </v-row>


                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="dialog_edit = false">Cancel</v-btn>
                                <v-btn color="blue darken-1" text @click="update_keyword">Xác nhận</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialog_share" max-width="500px">
                        <template v-slot:activator="{ on }">


                                    <v-btn @click="share_people" fab v-on="on" class=" mx-3" x-small dark color="primary">
                                        <v-icon dark>mdi-share-variant</v-icon>
                                    </v-btn>

                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">Chia sẻ {{keyword_select.length}} từ khóa</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-select
                                            v-model="member_select"
                                            :items="members"
                                            item-text="name_invite"
                                            item-value="id_invite"
                                            label="Người nhận"
                                            multiple
                                            chips
                                            persistent-hint

                                    >

                                    </v-select>

                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="dialog_share = false">Cancel</v-btn>
                                <v-btn color="blue darken-1" text @click="share_keyword">Chia sẻ</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn @click="delete_keyword_select" v-on="on" class="mx-2" x-small fab dark color="primary">
                                <v-icon dark>mdi-delete</v-icon>
                            </v-btn>
                        </template>
                        <span>Xóa</span>
                    </v-tooltip>
                </div>

                <v-spacer></v-spacer>
                <v-col class="mx-4" cols="12" sm="6" md="3">
                    <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Tra từ Khóa"
                            single-line
                            hide-details

                    ></v-text-field>
                </v-col>
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark class="mb-2" v-on="on">TẠO TỪ KHÓA</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field spellcheck="false" v-model="editedItem.key" label="Từ khóa"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field spellcheck="false" v-model="editedItem.brand" label="Thương Hiệu"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field spellcheck="false" type="number" v-model="editedItem.level" label="Cấp Độ"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field spellcheck="false" type="number" v-model="editedItem.stock" label="Tồn Kho"></v-text-field>
                                    </v-col>

                                </v-row>
                            </v-container>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                            <v-btn color="blue darken-1" text @click="save">Tạo</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

            </v-toolbar>
        </template>
        <template v-slot:item.action="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>

    </v-data-table>
    </div>
</template>
<script>
    import {mapState} from "vuex";

    export default {
        data: () => ({
            timeout:1000,
            notification:'',
            snackbar:false,
            keyword_select:[],
            member_select:[],
            dialog: false,
            dialog_share:false,
            dialog_edit:false,
            updateItem:{
                brand:null,
                level:null
            },
            headers: [
                {
                    text: 'Từ khóa',
                    align: 'left',
                    sortable: false,
                    value: 'key',
                },
                {text: 'Thương Hiệu', value: 'brand'},
                {text: 'Cấp độ', value: 'level'},
                {text: 'Tồn Kho', value: 'stock'},
                {text: 'Actions', value: 'action', sortable: false},

            ],

            editedIndex: -1,
            editedItem: {
                key: '',
                brand: "",
                level: 1,
                stock: "",
            },
            defaultItem: {
              key: '',
              brand: "",
              level: 1,
              stock: "",
            },
            search:'',
            selectSlot: false,
        }),

        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'Từ khóa' : 'Sửa từ khóa'
            },
            desserts(){
                return this.$store.state.keyword.keyword
            },
            ...mapState('share',[
                'members'
            ])

        },

        watch: {
            dialog(val) {
                val || this.close()
            },


        },

        created:async function(){
             await this.initialize();

        },

        methods: {
            update_keyword:async function(){
                for(let item of this.keyword_select){
                    if(this.updateItem.brand) item.brand = this.updateItem.brand;
                    if(this.updateItem.level) item.level = this.updateItem.level;
                    await this.$store.dispatch('keyword/update-keyword',item);
                }
                this.notification = 'Đã update xong '+this.keyword_select.length+' phần tử !';
                this.format();
            },
            format(){
                this.member_select = [];
                this.dialog_share = false;
                this.dialog_edit = false;
                this.updateItem ={
                        brand:null,
                        level:null
                };
                this.snackbar = true;
            },
            share_keyword:async function(){
                let members = this.member_select;
                let key_share = this.keyword_select.map(({id})=>id);
                await this.$store.dispatch('share/send-keyword',{members,key_share});
                this.notification = 'Chia sẻ thành công !';
                this.format();

            },
            share_people:async function(){
                await this.$store.dispatch('share/get-member');
            },
            initialize:async function(){
                 await this.$store.dispatch('keyword/get-keyword');
            },

            editItem(item) {
                this.editedIndex = this.desserts.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.dialog = true;

            },

            deleteItem(item) {
                const index = this.desserts.indexOf(item)
                confirm('Are you sure you want to delete this item?') && (this.$store.dispatch('keyword/remove-keyword',item) && this.desserts.splice(index, 1));

            },

            close() {
                this.dialog = false;
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                }, 300)
            },

            save() {
                if (this.editedIndex > -1) {
                    this.$store.dispatch('keyword/update-keyword',this.editedItem)
                    Object.assign(this.desserts[this.editedIndex], this.editedItem)
                } else {
                    this.$store.dispatch('keyword/push-keyword',this.editedItem);
                    this.desserts.push(this.editedItem)
                }
                this.close();

            },
            delete_keyword_select:async function(){
                for(let item of this.keyword_select){
                    await this.$store.dispatch('keyword/remove-keyword',item);
                    this.keyword_select = this.keyword_select.filter(({id})=>item.id !== id)
                }
                this.snackbar = true;
                this.notification = 'Đã xóa xong '+this.keyword_select.length+' phần tử !'


            }
        },
    }
</script>


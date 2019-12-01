<template>
    <v-data-table :headers="headers" :items="desserts" sort-by="calories" class="elevation-1">
        <template v-slot:top>
            <v-toolbar flat color="white">
                <v-toolbar-title>Danh sách Từ khóa</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
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
                                        <v-text-field spellcheck="false" v-model="editedItem.level" label="Cấp Độ"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field spellcheck="false" v-model="editedItem.share" label="Chia sẻ"></v-text-field>
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
</template>
<script>
    export default {
        data: () => ({
            dialog: false,
            headers: [
                {
                    text: 'Từ khóa',
                    align: 'left',
                    sortable: false,
                    value: 'key',
                },
                {text: 'Thương Hiệu', value: 'brand'},
                {text: 'Cấp độ', value: 'level'},
                {text: 'Chia sẻ', value: 'share'},
                {text: 'Actions', value: 'action', sortable: false},
            ],
            desserts: [],
            editedIndex: -1,
            editedItem: {
                key: '',
                brand: "",
                level: 1,
                share: "",
            },
            defaultItem: {
              key: '',
              brand: "",
              level: 1,
              share: "",
            },
        }),

        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'Từ khóa' : 'Sửa từ khóa'
            },

        },

        watch: {
            dialog(val) {
                val || this.close()
            },

        },

        created:async function(){
           return  await this.initialize();

        },

        methods: {
            initialize:async function(){
                return this.desserts = await this.$store.dispatch('keyword/get-keyword');
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
        },
    }
</script>


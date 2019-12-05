<template>

    <v-row>
        <v-col v-for="item in $store.state.share.waiters" :key="item.name_invite" cols="12" sm="6" md="6" lg="3">
            <v-card>
                <v-card-title class="subheading font-weight-bold">
                    {{ item.name_invite }}
                    <v-spacer></v-spacer>
                    <v-menu bottom left>
                        <template v-slot:activator="{ on }">
                            <v-btn dark icon v-on="on" color="grey">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>

                        <v-list>
                            <v-list-item  @click.stop="dialog_remove = true">
                                <v-list-item-title>Xóa</v-list-item-title>

                            </v-list-item>
                        </v-list>
                        <v-dialog v-model="dialog_remove" max-width="350">
                            <v-card>
                                <v-card-title class="headline">Xóa liên kết</v-card-title>

                                <v-card-text>
                                    Bạn có chắc chắn muốn ngắt kết nối tới {{item.name_invite}}?
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>

                                    <v-btn color="green darken-1" text @click="dialog_remove = false">
                                        Cancel
                                    </v-btn>

                                    <v-btn color="green darken-1" text @click="dialog_remove = false,remove_item(item)">
                                        Đồng ý
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                    </v-menu>
                </v-card-title>

                <v-divider></v-divider>

                <v-list dense>
                    <v-list-item v-for="({key,text}, index) in filteredKeys" :key="index">
                        <v-list-item-content :class="{ 'blue--text': sortBy === key }">{{ text }}:
                        </v-list-item-content>
                        <v-list-item-content   :class="{ 'blue--text': sortBy === key }">
                            <span v-if="key !== 'status_invite'">{{item[key] }}</span>
                            <div class="text-center">
                            <v-chip v-if="key === 'status_invite'"  :color="item[key]? 'green':'orange'" text-color="white">
                                {{item[key] == false ? 'Đang đợi chờ':'Connected'}}
                            </v-chip>
                            </div>


                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-col>
    </v-row>
</template>


<script>
    export default {
        data() {
            return {
                add_user: false,
                itemsPerPageArray: [4, 8, 12],
                search: '',
                filter: {},
                sortDesc: false,
                page: 1,
                itemsPerPage: 4,
                sortBy: 'name',
                options: [
                    { title: 'Xoá' }
                ],
                keys: [
                    {
                        text:'Email',
                        key:'email_invite'
                    },
                    {
                        text:'Time',
                        key:'createdAt'
                    },
                    {
                        text:'Status',
                        key:'status_invite'
                    },

                ],
                user: {
                    emailAddress: ''
                },
                user_default:{
                    emailAddress:''
                },
                dialog_remove: false
            }
        },

        computed:{
            filteredKeys() {
                return this.keys.filter(key => key !== `Name`)
            }
        },
        created:async function(){
            await this.initialize()
        },
        methods: {
            initialize:async function(){
                await this.$store.dispatch('share/get-request-member');
            },
            remove_item:async function(item){
                await this.$store.dispatch('share/remove-member',item);
            },
            close() {
                this.add_user = false;
                setTimeout(() => {
                    this.user = Object.assign({}, this.user_default)
                }, 300)
            },

        },
    }
</script>

<style scoped>

</style>

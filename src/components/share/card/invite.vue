<template>
    <v-row>
        <v-col v-for="item in  $store.state.share.invite" :key="item.name_from" cols="12" sm="6" md="6" lg="3">
            <v-card>
                <v-card-title class="subheading font-weight-bold">
                    {{ item.name_from }}
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
                                    Bạn có chắc chắn muốn ngắt kết nối tới {{item.name_from}}?
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
                            <div class=" text-center" v-if="key === 'status_invite'">

                            <v-btn @click="verify(item)" color="primary" x-small>Đồng ý </v-btn>

                                <v-btn @click="dialog_remove = true" class="mx-2" x-small>Hủy</v-btn>
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
                filter: {},
                keys: [
                    {
                        text:'Email',
                        key:'email_from'
                    },
                    {
                        text:'Tình trạng',
                        key:'status_invite'
                    }
                ],
                dialog_remove: false
            }
        },
        created:async function(){
            await this.initialize()
        },

        computed:{
            filteredKeys() {
                return this.keys.filter(key => key !== `Name`)
            }
        },
        methods: {
            verify:async function({id,email_from}){
                await this.$store.dispatch('share/verify-member',{id,email_from});
            },
            initialize:async function(){
                await this.$store.dispatch('share/get-invite-member');
            },
            remove_item:async function(item){
                await this.$store.dispatch('share/remove-member',item);
            }

        },
    }
</script>

<style scoped>

</style>

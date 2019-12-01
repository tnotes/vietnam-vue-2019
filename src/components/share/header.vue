<template>
    <v-toolbar color="white darken-3" class="mb-1">
        <v-tabs>
            <v-tab>Thành Viên</v-tab>
            <v-tab>Đợi Phản Hồi</v-tab>
        </v-tabs>
        <v-divider class="mx-4" inset vertical></v-divider>

        <v-spacer></v-spacer>


        <v-dialog v-model="add_user" max-width="400px">
            <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">Thêm người dùng</v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="headline">Thêm người dùng</span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6" md="12">
                                <v-text-field spellcheck="false" v-model="user.emailAddress"
                                              label="Nhập địa chỉ Email"></v-text-field>
                            </v-col>


                        </v-row>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="invite">Mời</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="error_show" top color="error" center>
            {{error}}
            <v-btn dark text @click="reset-error">
                Close
            </v-btn>
        </v-snackbar>
    </v-toolbar>
</template>
<script>
    import {mapActions} from 'vuex'
    export default {
        name: "header-card",
        data() {
            return {
                user:{
                    emailAddress:''
                },
                add_user: false,
            }
        },
        computed:{
            error(){
                return this.$store.state.share.error;
            },
            error_show(){
                return this.$store.state.share.error.length > 0;
            }
        },

        methods: {
            ...mapActions('share',[
                'reset-error'
            ]),
            reset:async function(){
                this.add_user = false;
                this.user = {emailAddress: ''}
            },
            invite:async function(){
               await this.$store.dispatch('share/add-member',this.user.emailAddress);
               return this.reset()
            },
            close() {
                this.add_user = false;
                setTimeout(() => {
                    this.user = Object.assign({}, this.user_default)
                }, 300)
            }
        },
    }
</script>

<style scoped>

</style>

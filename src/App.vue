<template>
    <v-app id="inspire">

        <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <v-list dense>

                <template v-for="item in items">
                    <v-row v-if="item.heading" :key="item.heading" align="center">
                        <v-col cols="6">
                            <v-subheader v-if="item.heading">
                                {{ item.heading }}
                            </v-subheader>
                        </v-col>
                        <v-col cols="6" class="text-center">
                            <a href="#!" class="body-2 black--text">EDIT</a>
                        </v-col>
                    </v-row>
                    <v-list-group v-else-if="item.children" :key="item.text" v-model="item.model" :prepend-icon="item.model ? item.icon : item['icon-alt']" append-icon="">
                        <template v-slot:activator>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{ item.text }}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </template>
                        <v-list-item v-for="(child, i) in item.children" :key="i" link>
                            <v-list-item-action v-if="child.icon">
                                <v-icon>{{ child.icon }}</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ child.text }}
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-group>
                    <v-list-item :to="item.path" v-else :key="item.text" link>
                        <v-list-item-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ item.text }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </template>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
                <span class="hidden-sm-and-down">Dmart Computer</span>
            </v-toolbar-title>
            <v-spacer />
            <v-btn to='/logout' icon>
                <v-icon>mdi-logout</v-icon> 
            </v-btn>
            
             
        </v-app-bar>
        <v-content>
            <keep-alive>
                <router-view/>
            </keep-alive>
        </v-content>

    </v-app>
</template>

<script>

export default {
  name: 'App',



    data: () => ({
        dialog: false,
        drawer: null,
        items: [
            { icon: 'mdi-contacts', text: 'Dữ Liệu Phân tích' ,path:'/' },
            { icon: 'mdi-history', text: 'Từ Khóa ',path:'/keyword' },

            { icon: 'mdi-content-copy', text: 'Chia sẻ nội dung',path:'/share' },
            { icon: 'mdi-settings', text: 'Cài Đặt Shop ',path:'/shop' },
        ],
    }),
};
</script>

<template>
    <v-container fluid>
        <HeaderCard/>
        <router-view/>
    </v-container>
</template>
<script>
    import HeaderCard from '../components/share/header';
    export default {
        components:{HeaderCard},
        data() {
            return {
                snackbar:true,
                items: [],
            }
        },
        created:async function(){

        },
        methods: {
        },
    }
</script>
<style scoped>

</style>

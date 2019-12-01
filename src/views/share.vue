<template>
    <v-container fluid>
        <HeaderCard/>
        <Card :items="items"/>
    </v-container>
</template>
<script>
    import Card from '../components/share/card';
    import HeaderCard from '../components/share/header';
    export default {
        components:{Card,HeaderCard},
        data() {
            return {
                snackbar:true,
                items: [],
            }
        },
        created:async function(){
            return await this.initialize();
        },
        methods: {
            initialize:async function(){
                let data = await this.$store.dispatch('share/get-member');
                return this.items = data;
            }
        },
    }
</script>
<style scoped>

</style>

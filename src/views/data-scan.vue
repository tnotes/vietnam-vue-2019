<template>
    <div>
        <HeaderScan/>
        <DataScan/>
    </div>
</template>


<script>
    import HeaderScan from '../components/data-scan/header';
    import DataScan from '../components/data-scan/data';

    export default {
        components:{HeaderScan,DataScan}
    }
</script>

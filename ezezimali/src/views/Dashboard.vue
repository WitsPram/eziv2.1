
<template>
    <div>jds</div>
    <button><a src="/apply-funding-manager">Fund Manager</a></button>
    <button><a src="/submit-funding-oppurtunity">Funding Opportunity</a></button>
</template>

<style></style>

<script>

export default {
    data() {
        return {
            email: '',
            username: '',
            password: ''
        };
    },
    methods: {
        register() {
            // Perform registration logic here
            // For simplicity, let's just assume registration is successful
            // and navigate to the next page
            this.$router.push('/next-page');
        }
    }, 
    onMounted() {

        
        
    
    }
};

</script>
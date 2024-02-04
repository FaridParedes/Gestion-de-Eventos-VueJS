<template>
    <v-footer class="lighten-1 estilofooter">
      <v-row justify="center" no-gutters>
        <v-col class="text-center mt-4" cols="12">
          {{ new Date().getFullYear() }} — <strong>HOEU</strong>
        </v-col>
      </v-row>
    </v-footer>
</template>

<script>
export default{
    name: 'FooterComponent',
}
</script>

<style scoped>
.estilofooter{
    z-index: 0;
    bottom: 0;
    width: 100%;
}
</style>
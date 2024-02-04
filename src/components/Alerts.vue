<template>
    <div class="Alerta">
        <v-alert density = "default" location="top center" position="fixed" :type="tipo" :title = "titulo"
        :text="msg">
        <v-btn border
          class="text-none"
          variant="outline" @Click="closeAlert">Cerrar</v-btn>
        </v-alert>
    </div>
</template>

<script>
export default {
    name: 'AlertComponent',
    props:{
        tipo: String,
        titulo: String,
        msg: String,
    },
    methods:{
        closeAlert(){
            this.$emit('closeAlert')
        }
    }
}
</script>

<style scoped>
.Alerta{ /* Opacidad del fondo */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center; 
  z-index: 100;/* Z-index alto para superponer otros elementos */
}
</style>
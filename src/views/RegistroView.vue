<template>
    <v-alert
          color="error"
          value="error"
          class="d-flex justify-center"
          closable
        v-model="correoFail "
      >
          Ya existe una cuenta asociada al correo
    </v-alert>
    <Registro @sendRegistro="saveRegistro"/>
    <v-dialog
    v-model="dialog"
    width="auto"
    class="text-center"
    >
    <v-card v-if="carga">
        <v-card-text>
            <v-progress-circular
            indeterminate
            color="blue-darken-4"
            ></v-progress-circular>
        </v-card-text>
    </v-card>
    <v-card v-if="completada" class="text-center">
        <v-card-text>
            <v-avatar size="200"> 
                <v-icon
                class="mb-6"
                color="success"
                icon="mdi-check-circle-outline"
                size="128"></v-icon> 
            </v-avatar>
            <p>Usuario registrado correctamente</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue-darken-4" block @click="cerrarDialog">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import Registro from '@/components/Registro.vue';
import axios from 'axios';

export default{
    name: 'RegistroView',
    data() {
        return {
            completada: false,
            carga:true,
            dialog:false,
            correoFail: false,
            Resultado:{},
        }
    },
    components:{
        Registro,
    },
    methods: {
        cerrarDialog(){
            this.dialog=false;
            this.$router.push('/login');
        },
        async saveRegistro(Registro){
            this.dialog=true;
            await axios.post('http://localhost:8000/api/registro', Registro)
            .then(({data})=>{
                console.log(data);
                if(data.status === true){
                    this.carga = false;
                    this.completada = true;
                } else if(data.status === false){
                    this.dialog=false;
                    this.carga = false;
                    this.correoFail = true;
                }
            })
            .catch(error => console.log('Hubo un error ', error,)
            )
        }
    },
    beforeCreate() {
    if (this.$store.getters.getSession === true) {
      this.$router.push("/");
    }
  },
}
</script>

<style scoped>

</style>
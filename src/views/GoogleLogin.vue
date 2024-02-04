<template>
  <div class="fill-height d-flex align-center justify-center">
    <div align="center" v-show="cargando">
      <p class="">Espere mientras se inicia la sesión.</p>

      <v-progress-circular
        class="bg-white ma-auto"
        :size="70"
        :width="7"
        color="blue-darken-4"
        indeterminate
      ></v-progress-circular>
    </div>
    <div align="center" v-show="aprobado">
      <v-card class="text-center">
        <v-card-text>
            <v-avatar size="200"> 
                <v-icon
                class="mb-6"
                color="success"
                icon="mdi-check-circle-outline"
                size="128"></v-icon> 
            </v-avatar>
            <p>Sesión iniciada correctamente</p>
        </v-card-text>
      </v-card>
    </div>

    <div align="center" v-show="denegado">
      <v-card class="text-center">
          <v-card-text>
            <v-avatar size="200">
              <v-icon
                class="mb-6"
                color="red"
                icon="mdi-alert-circle-outline"
                size="128"
              ></v-icon>
            </v-avatar>
            <p>Ups, hubo un error!</p>
          </v-card-text>
        </v-card>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default{
  name: 'GoogleLogin',
  data(){
    return{
      cargando: true,
      aprobado: false,
      denegado: false,
    }
  }, 
  methods: {
    
  },
  beforeCreate(){
    const userId = this.$route.params.id;
    const token = this.$route.params.token;

    axios.post('http://localhost:8000/api/google/login/check',{userId},{
        headers: {
          Authorization:
            "Bearer " + token,
        },
    }).then(({data}) =>{
      if(data.status === true){
        this.cargando = false;
        this.aprobado = true;
        localStorage.setItem("token", JSON.stringify(data.access_token));
        localStorage.setItem("session", JSON.stringify("true"));
        this.$store.dispatch('cargarUsuario', data.user); 
        this.$router.push('/myevents');
      } else {
        this.cargando = false;
        this.denegado = true;
      }
    }).catch(error=>{
      this.cargando = false;
      this.denegado = true;
      console.log(error)
    })
  },
  created() {
    
  },

}
</script>


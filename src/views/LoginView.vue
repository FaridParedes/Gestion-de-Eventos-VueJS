<template>
    <v-alert
          color="error"
          value="error"
          class="d-flex justify-center"
          closable
        v-model="sesionFail "
      >
          El correo o la contraseña son erróneos 
    </v-alert>
    <Login @login="tryLogin"/> 
</template>

<script>
import Login from '@/components/Login.vue';
import axios from 'axios';

export default{
    name: 'LoginView',
    data() {
        return {
            sesionFail: false,
        }
    },
    components:{
        Login,
    },
    methods: {
        tryLogin(Credenciales){
            axios.post('http://localhost:8000/api/login/auth', Credenciales)
            .then(({data})=>{
                if(data.status === true){
                    //const infoUsuario = data.body;
                    localStorage.setItem("token", JSON.stringify(data.access_token));
                    localStorage.setItem("session", JSON.stringify("true"));
                    //localStorage.setItem("user", JSON.stringify(data.user));
                    //localStorage.getItem("usuario")
                    //Este convirtiendolo a JSON: JSON.parse(localStorage.getItem("usuario")
                    this.$store.dispatch('cargarUsuario', data.user); 
                    this.$router.push('/myevents');
                } else if(data.status === false){
                    this.sesionFail = true;
                }
            });
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
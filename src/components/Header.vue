<template>
  <nav>
    <v-toolbar class="" color="blue-darken-4">
      <v-app-bar-nav-icon @Click="drawer = !drawer" v-if="this.$store.getters.getSession===true"></v-app-bar-nav-icon>

      <v-toolbar-title>HOEU</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon >
            <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <div v-if="this.$store.getters.getSession === false">
        <v-btn variant="text" to="/login">
          Iniciar Sesión
        </v-btn>
        /
        <v-btn variant="text" to="/registro">
          Registrarse
        </v-btn>
      </div>
    </v-toolbar>

    <v-navigation-drawer v-model="drawer" temporary color="blue-lighten-3">
      <v-list v-if="this.$store.getters.getSession === true">
        <v-list-item
        v-if="this.$store.getters.getUsuario.fotoPerfil===null"
        prepend-avatar="https://previews.123rf.com/images/hugok1000/hugok10001905/hugok1000190500198/123291745-default-profile-avatar-illustration-in-blue-and-white-no-person.jpg"
        :title="this.$store.getters.getUsuario.name + ' ' +this.$store.getters.getUsuario.lastName "
          :subtitle="this.$store.getters.getUsuario.email"
        ></v-list-item>
        <v-list-item
          v-else
          :prepend-avatar="this.$store.getters.getUsuario.fotoPerfil"
          :title="this.$store.getters.getUsuario.name + ' ' +this.$store.getters.getUsuario.lastName "
          :subtitle="this.$store.getters.getUsuario.email"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-home" title="Inicio" to="/"></v-list-item>
        <div>
          <v-list-item prepend-icon="mdi-calendar-multiple-check" title="Mis eventos" to="/myevents" v-if="this.$store.state.usuario.rol === 'org'"></v-list-item>
          <v-list-item prepend-icon="mdi-check" title="Mis asistencias" to="/misasistencias"></v-list-item>
          <v-list-item prepend-icon="mdi-calendar-month" title="Calendario" to="/calendario"></v-list-item>
          <v-list-item prepend-icon="mdi-account-multiple" title="Mi cuenta" to="/myaccount"></v-list-item>
        </div>
        </v-list>

      <template v-slot:append>
          <div class="pa-2">
            <v-btn 
            :disbled="loading"
            :loading="loading"
            block 
            @Click="cerrarSesion">
              Cerrar Sesión
            </v-btn>
          </div>
        </template>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HeaderComponent',
  data(){
    return{
      loading: false,
      drawer: false,
      userName:this.$store.getters.getUsuario.name,
      userEmail:this.$store.getters.getUsuario.email,
      Miavatar: '../assets/perfil.png',
    }
  },
  methods:{
    cerrarSesion(){
      this.loading= true;
      let data = []
      let id = this.$store.getters.getUsuario.id;
      axios.post('http://localhost:8000/api/logout',{id},{
        headers:{
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
        }
      }).then(response=>{
        localStorage.removeItem('token');
        localStorage.removeItem('session');
        this.$store.dispatch('cerrarUsuario', data);
        this.loading= false;
        this.$router.push('/login')
        console.log(response)
      }).catch(error=>{
        this.loading= false;
        console.log(error)
      })
    }
  },
  async beforeCreate() {
    let data = JSON.parse(localStorage.getItem("token"))
    if(data){
      const response  = await axios.get('http://localhost:8000/api/user',{
        headers:{
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
        }
      });
      this.$store.dispatch('cargarUsuario', response.data);
    }
  },
}
</script>
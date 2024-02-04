<template>
  <Header></Header>
  <div class="ma-8">
    <div><h1>Mis Asistencias</h1></div>

    <!-- Inicio v-card Cargando -->
    <div
      class="elevation-6 pa-5 rounded-lg"
      height="100"
      v-show="barraCargando"
    >
      <v-row>
        <v-col>
          <v-card class="mx-auto align-end text-black w-100">
            Cargando tus asistencias...
            <v-progress-linear
              indeterminate
              color="blue-darken-4"
            ></v-progress-linear>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <!-- Fin v-card Cargando -->

    <!-- Inicio error asistencias -->
    <div class="elevation-6 pa-5 rounded-lg" height="100" v-show="errorCargado">
      <v-row>
        <v-col>
          <v-card class="mx-auto align-end text-black" max-width="400">
            <v-card-title> No se encontraron eventos 
              <v-icon icon="mdi-emoticon-sad"></v-icon>
            </v-card-title>
            <v-card-subtitle>
              Cuando asistas a un evento aparecerá aquí.
            </v-card-subtitle>
            <v-card-text>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <!-- Fin error asistencias -->

    <!-- Inicio v-card eventos -->
    <div class="elevation-6 pa-5 rounded-lg" v-show="eventosCargados">
      <v-row>
        <v-col cols="12" sm="6" md="4" v-for="evento in ArreglodeEventos" :key="evento.id">
          <v-card class="bg-blue-lighten-5 mx-auto align-end text-black" max-width="400">
            <div v-if="evento.imagen.length > 0">
              <v-carousel
                height="200"
                hide-delimiters
                :show-arrows="evento.imagen.length > 1 ? 'hover' : false"
              >
                <v-carousel-item
                  v-for="(imagen, i) in evento.imagen"
                  :key="i"
                  :src="imagen"
                  cover
                ></v-carousel-item>
              </v-carousel>
            </div>
            <div v-else>
              <v-carousel
                hide-delimiters
                :continuous="false"
                :show-arrows="false"
                height="200"
                cover
              >
                <v-carousel-item
                  src="../assets/sinFoto.png"
                  cover
                ></v-carousel-item>
              </v-carousel>
            </div>

            <v-card-title>{{ evento.title }}</v-card-title>

            <v-card-subtitle>
              Organizador: {{ evento.organizador + ' ' + evento.organizadorLastName }}</v-card-subtitle
            >

            <v-divider class="mx-4 mb-1"></v-divider>

            <v-card-text>
              <div class="text-red">Inicia: {{ evento.start }}</div>

              <div class="">Ubicación: {{ evento.ubication }}</div>

              <div class="text-gray">Categoria: {{ evento.categoria }}</div>
            </v-card-text>
            <v-card-actions>
              <v-btn color="orange-darken-4" @Click="verMasEvento(evento.id)"> Ver más </v-btn>
              <v-spacer></v-spacer>

              <v-btn
                variant="text"
                color="red-darken-4"
                icon="mdi-delete"
                @click="openDialogEliminar(evento.asistencia)"
              ></v-btn>

            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-pagination
        class="ma-4"
        v-model="currentPage"
        :length="lastPage"
        :total-visible="5"
      ></v-pagination>
    </div>
    <!-- Fin v-card eventos -->

    <!-- dialog para eliminar asistencia -->
    <v-dialog v-model="seguroEliminar" width="auto" class="text-center">
      <v-card>
        <v-card-text>
            <v-avatar size="200">
              <v-icon
                class="mb-6"
                color="red"
                icon="mdi-alert-circle-outline"
                size="128"
              ></v-icon>
            </v-avatar>
            <p>¿Seguro que desea eliminar su asistencia a este evento?</p>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="flat" color="green" prepend-icon="mdi-check" @click="eliminarAsistencia">Aceptar</v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="red" prepend-icon="mdi-close" @Click="closeDialogEliminar">Cancelar</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- fin dialog para eliminar asistencia -->

    <!-- FeedBack al eliminar asistencia -->
    <v-snackbar v-model="snackBarEliminarEvento" timeout="3000" color="blue-lighten-3">
      Asistencia eliminada correctamente.
    </v-snackbar>
    <v-snackbar v-model="snackBarFalseEliminarEvento" timeout="3000" color="red-darken-4">
      Hubo un error, intentalo más tarde.
    </v-snackbar>
    <!-- Fin feedback -->

  </div>
  <Footer />
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import axios from "axios";

export default {
  name: "MisAsistencias",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      barraCargando: true,
      errorCargado: false,
      eventosCargados: false,

      seguroEliminar: false,
      snackBarEliminarEvento: false,
      snackBarFalseEliminarEvento: false,
      saveIdDelete: '',
      categoriaSeleccionada: [],
      ubicacionSeleccionada: [],
      fechaSeleccionada: "",
    };
  },
  methods: {
    verMasEvento(id){
      this.$router.push('/event/'+id)
    },

    openDialogEliminar(id){
      this.saveIdDelete = id;
      this.seguroEliminar = true;
    },

    closeDialogEliminar(){
      this.seguroEliminar = false;
      this.saveIdDelete = '';
    },

    async eliminarAsistencia(){
      axios.delete('http://localhost:8000/api/user/events/misasistencias/destroy/' + this.saveIdDelete,{
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
        },
      }).then(response=>{
          this.saveIdDelete = ''
          this.seguroEliminar = false;
          this.snackBarEliminarEvento = true;

          axios.get('http://localhost:8000/api/user/events/misasistencias',{
            headers:{
              Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
            }
          }).then(response=>{
            if(response.data.code === 200){
              this.$store.commit('setMisAsistencias', response.data.data)
            } else{
              this.barraCargando = false
              this.errorCargado = true;
            }
            
          }).catch(error=>{
            this.barraCargando = false
            this.errorCargado = true;
            console.log(error)
          })
          console.log(response)
      }).catch(error=>{
          this.carga = false;
          this.cargando = false;
          this.snackBarFalseEliminarEvento = true;
          console.log(error);
      })
    },
    paginatePage(pageNumber){
      this.$store.dispatch('cargarMisAsistencias',pageNumber);
    }
  },
 async beforeCreate() {
    let session = JSON.parse(localStorage.getItem("session"));
    if ((await session) != "true") {
      this.$router.push("/");
    } else {
      const response = await axios.get("http://localhost:8000/api/user", {
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
        }
      });
      this.$store.dispatch("cargarCategorias");
      this.$store.dispatch("cargarEstados");
      this.$store.dispatch("cargarUsuario", response.data);
      this.$store.dispatch("cargarMyEvents", 0);
      this.$store.dispatch("cargarUbicaciones");
    }
  },
  created() {
    axios.get('http://localhost:8000/api/user/events/misasistencias?page=1',{
        headers:{
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
        }
      }).then(response=>{
        if(response.data.code === 200){
          this.$store.commit('setMisAsistencias', response.data.data)
        } else{
          this.barraCargando = false
          this.errorCargado = true;
        }
        
      }).catch(error=>{
        this.barraCargando = false
        this.errorCargado = true;
        console.log(error)
      })
  },
  watch:{
    currentPage(newVal){
      this.paginatePage(newVal);
    },
    ArreglodeEventos(){
      if(this.ArreglodeEventos.length === 0){
        this.barraCargando = false;
        this.errorCargado = true;
        if(this.eventosCargados){
          this.eventosCargados = false;
        }
      } else{
        console.log(this.ArreglodeEventos)
        this.barraCargando = false;
        this.eventosCargados = true;
        if (this.errorCargado === true) {
          this.errorCargado = false;
        }
      }
    }
  },
  computed:{
    currentPage: {
      get() {
        return this.$store.state.misAsistencias.current_page;
      },
      set(value) {
        this.$store.commit("setCurrentPageMisAsistencias", value);
      },
    },
    lastPage: {
      get() {
        return this.$store.state.misAsistencias.last_page;
      },
    },
    ArreglodeEventos: {
      get() {
        return this.$store.state.misAsistencias.data || [];
      },
    },
  }
};
</script>

<style scoped></style>

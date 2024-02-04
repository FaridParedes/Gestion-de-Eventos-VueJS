<template>
  <Header></Header>
  <div class="ma-8">
    <div><h1>Próximos Eventos</h1></div>
    Filtrar eventos por:
    <v-form ref="formFiltro">
        <v-row class="">
        <v-col cols="12" md="4">
          <v-select
            clearable
            chips
            label="Categoria"
            multiple
            v-model="categoriaSeleccionada"
            class="h-50"
            :items="this.$store.getters.getCategorias"
            item-title="name"
            item-value="id"
          ></v-select>
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            multiple
            clearable
            chips
            v-model="ubicacionSeleccionada"
            label="Ubicacion"
            :items="this.$store.getters.getUbicaciones"
          ></v-select>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field type="date" v-model="fechaSeleccionada" label="Fecha"></v-text-field>
        </v-col>
        <!-- Boton para filtrar -->
        <v-col cols="6" md="1">
          <v-btn :disabled="loading" :loading="loading" block size="x-large" color="blue"
            @click="filtrarEventos"  
          ><v-icon icon="mdi-filter-variant"></v-icon
          ></v-btn>
        </v-col>
        <v-col cols="6" md="1">
          <v-btn :disabled="loading2" :loading="loading2" block size="x-large" color="red"
          @click="eliminarFiltroEventos"
          ><v-icon icon="mdi-filter-variant-remove"></v-icon></v-btn>
        </v-col>
      </v-row>
    </v-form>
    

    <!-- Inicio v-card Cargando -->
    <div
      class="elevation-6 pa-5 rounded-lg"
      height="100"
      v-show="barraCargando"
    >
      <v-row>
        <v-col>
          <v-card class="mx-auto align-end text-black w-100">
            Cargando eventos...
            <v-progress-linear
              indeterminate
              color="blue-darken-4"
            ></v-progress-linear>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <!-- Fin v-card Cargando -->

    <!-- Inicio v-card no se encontraron eventos -->
    <div class="elevation-6 pa-5 rounded-lg" height="100" v-show="errorCargado">
      <v-row>
        <v-col>
          <v-card class="mx-auto align-end text-black" max-width="400">
            <v-card-title> No se encontraron eventos </v-card-title>
            <v-card-subtitle> Vuelve más tarde... </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <!-- Final v-card no se encontraron eventos -->

    <!-- Inicio v-card de eventos con ciclo for -->
    <div class="elevation-6 rounded-lg" v-show="eventosCargados">
      <v-row>
        <v-col cols="12" sm="6" md="4" v-for="evento in ArreglodeEventos" :key="evento.id">
          <v-card class="bg-blue-lighten-5 mx-auto align-end text-black" max-width="400">
            <div v-if="evento.imagen.length > 0">
              <v-carousel height="200" hide-delimiters :show-arrows="evento.imagen.length > 1 ? 'hover' : false">
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
                height="200"
                cover
                :show-arrows="false"
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
              <template v-if="this.$store.state.usuario.id === evento.organizadorId">
                <v-btn disabled color="orange-darken-4">
                  Eres el organizador
                </v-btn>
                <v-btn color="orange-darken-4" @Click="verMasEvento(evento.id)"> Ver más </v-btn>

                <v-spacer></v-spacer>

                <v-btn disabled color="red-darken-4" icon="mdi-heart-outline"></v-btn>

              </template>

              <template v-else>
                <template v-for="asistente in ArreglodeAsistentes" :key="asistente.id">
                  <div v-if="evento.id === asistente.eventoId && asistente.userId === this.$store.state.usuario.id">
                    <v-btn disabled color="orange-darken-4" prepend-icon="mdi-check">Asistente</v-btn>
                  </div>
                </template>

                <v-btn v-if="!usuarioEsAsistente(evento)" color="orange-darken-4" @click="openAsistirForm(evento)">Asistir</v-btn>

                <v-btn color="orange-darken-4" @Click="verMasEvento(evento.id)"> Ver más </v-btn>

                <v-spacer></v-spacer>

                <template v-if="this.$store.state.session === true">
                    <div v-for="favorito in ArreglodeFavoritos" :key="favorito.id">
                      <div v-if="evento.id === favorito.eventoId && favorito.userId === this.$store.state.usuario.id">
                        <v-btn
                        :disabled="noFavLoading"
                        :loading="noFavLoading"
                        color="red-darken-4" 
                        icon="mdi-heart"
                        @click="deleteFavoritos(favorito.id)"
                        ></v-btn>
                      </div>
                    </div>
                    
                    <v-btn
                    v-if="!eventoEsFavorito(evento)"
                    :disabled="favLoading"
                    :loading="favLoading"
                    color="red-darken-4" 
                    icon="mdi-heart-outline"
                    @click="addFavoritos(evento.id)"
                    ></v-btn>
                    
                </template>

              </template>           

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
    <!-- Fin v-card de eventos con ciclo for -->
    
    <!--Inicio v-card de eventos filtrados  -->
    <div class="elevation-6 rounded-lg" v-show="eventosFiltradosCargados">
      <v-row>
        <v-col cols="12" sm="6" md="4" v-for="evento in arregloEventosFiltrados" :key="evento.id">
          <v-card class="bg-blue-lighten-5 mx-auto align-end text-black" max-width="400">
            <div v-if="evento.imagen.length > 0">
              <v-carousel height="200" hide-delimiters :show-arrows="evento.imagen.length > 1 ? 'hover' : false">
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
                height="200"
                cover
                :show-arrows="false"
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
              <template v-if="this.$store.state.usuario.id === evento.organizadorId">
                  <v-btn disabled color="orange-darken-4">
                    Eres el organizador
                  </v-btn>
                  <v-btn color="orange-darken-4" @Click="verMasEvento(evento.id)"> Ver más </v-btn>

                  <v-spacer></v-spacer>

                  <v-btn disabled color="red-darken-4" icon="mdi-heart-outline"></v-btn>

                </template>

                <template v-else>
                  <template v-for="asistente in ArreglodeAsistentes" :key="asistente.id">
                    <div v-if="evento.id === asistente.eventoId && asistente.userId === this.$store.state.usuario.id">
                      <v-btn disabled color="orange-darken-4" prepend-icon="mdi-check">Asistente</v-btn>
                    </div>
                  </template>

                  <v-btn v-if="!usuarioEsAsistente(evento)"  color="orange-darken-4" @click="openAsistirForm(evento)">Asistir</v-btn>

                  <v-btn color="orange-darken-4" @Click="verMasEvento(evento.id)"> Ver más </v-btn>

                  <v-spacer></v-spacer>

                  <template v-if="this.$store.state.session === true">
                      <div v-for="favorito in ArreglodeFavoritos" :key="favorito.id">
                        <div v-if="evento.id === favorito.eventoId && favorito.userId === this.$store.state.usuario.id">
                          <v-btn
                          :disabled="noFavLoading"
                          :loading="noFavLoading"
                          color="red-darken-4" 
                          icon="mdi-heart"
                          @click="deleteFavoritos(favorito.id)"
                          ></v-btn>
                        </div>
                      </div>
                      
                      <v-btn
                      v-if="!eventoEsFavorito(evento)"
                      :disabled="favLoading"
                      :loading="favLoading"
                      color="red-darken-4" 
                      icon="mdi-heart-outline"
                      @click="addFavoritos(evento.id)"
                      ></v-btn>
                      
                  </template>
                 
                </template>           

            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <!-- Fin v-card de eventos filtrados -->

    <!-- Inicio v-dialog para asistir a un evento -->
    <v-dialog class="Dialogo" v-model="dialog">
      <v-card title="Formulario de asistencia">
        <v-form class="ma-5" ref="form">
          <v-row no-gutters>
            <v-col  cols="12" md="6">
              <v-text-field
                class="pa-1"
                v-model="Registro.name"
                density="compact"
                :rules="rulesName"
                required
                placeholder="Nombre"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                class="pa-1"
                v-model="Registro.lastName"
                density="compact"
                :rules="rulesLastName"
                required
                placeholder="Apellido"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-text-field
            class="pa-1"
            v-model="Registro.email"
            density="compact"
            :rules="[rulesEmail, rulesMail2]"
            required
            placeholder="Correo"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
          ></v-text-field>
          <v-text-field
            class="pa-1"
            v-model="titleEvento"
            density="compact"
            placeholder="Título del evento"
            variant="outlined"
            readonly
          ></v-text-field>

          <v-row>
            <v-col>
              <v-btn
                block
                class="mb-2"
                color="blue"
                size="large"
                variant="tonal"
                @click.prevent="sendRegistro()"
              >
                Registrar Asistencia
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                block
                class="mb-2"
                color="gray"
                size="large"
                variant="tonal"
                @click="closeAsistirForm"
              >
                <v-icon start icon="mdi-minus-circle"></v-icon>
                Cancelar
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>

      <!-- v-dialog alertas -->
      <v-dialog v-model="cargando" width="auto" class="text-center">
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
                    size="128"
                  ></v-icon>
                </v-avatar>
                <p>Asistencia registrada correctamente</p>
              </v-card-text>
              <v-card-actions>
                <v-btn color="blue-darken-4" block @click="cerrarCargando"
                  >Cerrar</v-btn
                >
              </v-card-actions>
            </v-card>
            <v-card v-if="error" class="text-center">
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
              <v-card-actions>
                <v-btn color="blue-darken-4" block @click="cerrarCargando"
                  >Cerrar</v-btn
                >
              </v-card-actions>
            </v-card>
            <v-card v-if="errorExistencia" class="text-center">
              <v-card-text>
                <v-avatar size="200">
                  <v-icon
                    class="mb-6"
                    color="orange"
                    icon="mdi-alert"
                    size="128"
                  ></v-icon>
                </v-avatar>
                <p>Ya eres un asistente!</p>
              </v-card-text>
              <v-card-actions>
                <v-btn color="blue-darken-4" block @click="cerrarCargando"
                  >Cerrar</v-btn
                >
              </v-card-actions>
            </v-card>
      </v-dialog>
      <!-- fin dialog alertas -->
    </v-dialog>
      <!-- Fin v-dialog para asistir a un evento -->
  </div>
  <v-snackbar v-model="snackBarFalseNoHayEventos" timeout="3000" color="red-darken-4">
      No se encontrarón eventos con los filtros seleccionado.
  </v-snackbar>
  <v-snackbar v-model="snackBarFalseErrorFiltro" timeout="3000" color="red-darken-4">
      Hubo un error, intentalo más tarde.
    </v-snackbar>
  <Footer />
</template>

<script>
import { defineComponent } from "vue";

// Components
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import axios from "axios";

export default defineComponent({
  name: "HomeView",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      barraCargando: true,
      eventosCargados: false,
      eventosFiltradosCargados: false,
      errorCargado: false,
      pruebaCargando: false,
      pruebaparaver: true,
      dialog: false,
      cargando:false,
      carga:false,
      completada:false,
      error: false,
      errorExistencia: false,
      loading: false,
      loading2: false,
      snackBarFalseNoHayEventos: false,
      snackBarFalseErrorFiltro: false,
      favLoading: false,
      noFavLoading: false,
      categoriaSeleccionada: [],
      ubicacionSeleccionada: [],
      fechaSeleccionada: '',
      titleEvento: "",
      idEvento: 0,
      Registro: {
        name:  "",
        lastName:  "",
        email:  "",
        registro: "",
        userId: (this.$store.state.session) ? this.$store.state.usuario.id : null,
        eventoId: "",
      },
      rulesName: [(v) => !!v || "Nombre requerido"],
      rulesLastName: [(v) => !!v || "Apellido requerido"],
      rulesEmail: value => !!value || 'Correo requerido.',
      rulesMail2: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
      },
    };
  },
  methods: {
    deleteFavoritos(id){
      this.noFavLoading = true;
      try {
        axios.delete('http://localhost:8000/api/user/favoritos/destroy/'+id,{
          headers:{
            Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
          }
        }).then(response=>{
          this.$store.dispatch('cargarFavoritos');
          console.log(response)
          this.noFavLoading = false;
        }).catch(error=>{
          console.log(error)
          this.noFavLoading = false;
        })
      } catch (error) {
        console.log(error)
        this.noFavLoading = false;
      }
    },
    addFavoritos(id){
      this.favLoading = true;
      try {
        let favoritoObject ={
          userId: this.$store.state.usuario.id,
          eventoId: id
        }
        axios.post('http://localhost:8000/api/user/favoritos/add', favoritoObject,{
          headers:{
            Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
          }
        }).then(response =>{
          this.$store.dispatch('cargarFavoritos');
          this.favLoading = false;
          console.log(response)
        }).catch(error=>{
          this.favLoading = false;
          console.log(error)
        })
      } catch (error) {
        this.favLoading = false;
        console.log(error)
      }
    },

    eventoEsFavorito(evento){
      return this.ArreglodeFavoritos.some(favorito => {
        return favorito.eventoId === evento.id && favorito.userId === this.$store.state.usuario.id;
      });
    },

    usuarioEsAsistente(evento) {
      return this.ArreglodeAsistentes.some(asistente => {
        return asistente.eventoId === evento.id && asistente.userId === this.$store.state.usuario.id;
      });
    },

    filtrarEventos(){
      let data = [];
      this.$store.commit('setEventosFiltrados', data)
      this.loading = true;
      this.eventosCargados = false;
      this.barraCargando = true;
      let filtros = {
        categoriasId:null,
        ubicaciones: null,
        fecha: null
      }
      if(this.categoriaSeleccionada){
        filtros.categoriasId = this.categoriaSeleccionada
      } if(this.ubicacionSeleccionada){
        filtros.ubicaciones = this.ubicacionSeleccionada
      }if(this.fechaSeleccionada){
        filtros.fecha = this.fechaSeleccionada
      }
      axios.post('http://localhost:8000/api/events/filter', filtros)
      .then(response=>{
        console.log(response)
        if(response.data.code === 200){
          this.$store.commit('setEventosFiltrados', response.data.data);
          this.barraCargando = false;
          this.eventosFiltradosCargados = true;
          this.loading = false;
        } else{
          this.loading = false;
          this.barraCargando = false;
          this.snackBarFalseNoHayEventos = true;
          this.eventosCargados = true;
        }
      }).catch(error=>{
        this.loading = false;
        this.snackBarFalseErrorFiltro = true;
        this.barraCargando =false;
        this.eventosCargados = true;
        console.log(error)
      })
    },

    eliminarFiltroEventos(){
      this.loading2 = true;
      this.$refs.formFiltro.reset();
      const condicion = this.arregloEventosFiltrados
      if(condicion.length > 0){
        let data = [];
        this.$store.commit('setEventosFiltrados', data)
        this.eventosCargados = true;
        this.eventosFiltradosCargados = false;
        this.loading2 = false;
      }else{
        this.eventosCargados = true;
        this.eventosFiltradosCargados = false;
        this.loading2 = false
      }
    },

    openAsistirForm(evento) {
      this.dialog = true;
      this.titleEvento = evento.title;
      this.idEvento = evento.id;
      console.log(this.Registro.userId)
    },
    closeAsistirForm() {
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
      this.Registro.name = (this.$store.state.session) ? this.$store.state.usuario.name : "";
      this.Registro.lastName = (this.$store.state.session) ? this.$store.state.usuario.lastName : "";
      this.Registro.email = (this.$store.state.session) ? this.$store.state.usuario.email : "";
      this.Registro.userId = (this.$store.state.session) ? this.$store.state.usuario.id : null;
      this.dialog = false;
    },

    cerrarCargando(){
      this.completada = false;
      this.cargando = false;
      if (this.error) {
        this.error = false;
      }
      if(this.errorExistencia){
        this.errorExistencia = false;
      }
      this.closeAsistirForm();
    },

    verMasEvento(id){
      this.$router.push('/event/'+id)
    },

    sendRegistro(){
      this.cargando = true;
      this.carga =  true;
      this.Registro.eventoId = this.idEvento;
      console.log(this.Registro)
      axios.post('http://localhost:8000/api/asistente/new', this.Registro)
      .then(response =>{
        this.carga= false;
        if(response.data.data == "AsistenciaExistente"){
          this.errorExistencia = true;
        }else{
          this.$store.dispatch('cargarAsistentesTodos');
          this.completada = true;
        }
        console.log(response)
      }).catch(error=>{
        this.carga = false;
        this.error = true;
        console.log(error)
      })
    },

    paginatePage(pageNumber){
      this.$store.dispatch('cargarEventos',pageNumber);
    },
  },
  async beforeCreate() {
    let data = JSON.parse(localStorage.getItem("token"));
    if (data) {
      const response = await axios.get("http://localhost:8000/api/user", {
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
        },
      });
      this.$store.dispatch("cargarUsuario", response.data);
    }

    //CargarDatos
    this.$store.dispatch("cargarCategorias");
    this.$store.dispatch("cargarEstados");
    try {
      this.$store.dispatch("cargarEventos",0);
    } catch (error) {
      this.barraCargando = false;
    }
    this.$store.dispatch("cargarMyEvents",0);
    this.$store.dispatch('cargarMyEventsCalendar');
    this.$store.dispatch('cargarUbicaciones');
    this.$store.dispatch('cargarAsistentesTodos');
    this.$store.dispatch('cargarFavoritos');
    //this.$store.dispatch('enviarNotificaciones');

  },
  created() {
    const fechaInicio = new Date();
    const year = fechaInicio.getFullYear();
    const month = String(fechaInicio.getMonth() + 1).padStart(2, "0");
    const day = String(fechaInicio.getDate()).padStart(2, "0");

    // Formatea la fecha en "yyyy-mm-dd hh:mm:ss"
    const fechaFormateada = `${year}-${month}-${day}`;
    this.Registro.registro = fechaFormateada;

    if (this.$store.state.session) {
      this.Registro.name =this.$store.state.usuario.name;
      this.Registro.lastName =this.$store.state.usuario.lastName;
      this.Registro.email =this.$store.state.usuario.email;
      this.Registro.userId = this.$store.state.usuario.id;
    }
  },
  async mounted() {

  },
  watch:{
    currentPage(newVal){
      this.paginatePage(newVal)
    },
     ArreglodeEventos(){
      if(this.ArreglodeEventos.length === 0){
        this.barraCargando = false;
        this.errorCargado = true;
      }else{
        this.barraCargando = false;
        this.eventosCargados = true;
        if(this.errorCargado === true){
          this.errorCargado = false;
        }
      }
     },
  },
  computed:{
    currentPage: {
      get(){
        return this.$store.state.events.current_page
      },
      set(value){
        this.$store.commit('setCurrentPageEvents', value)
      }
    },
    lastPage:{
      get(){
        return this.$store.state.events.last_page
      }
    },
    ArreglodeEventos:{
      get(){
        return this.$store.state.events.data || []
      }
    },
    arregloEventosFiltrados:{
      get(){
        return this.$store.state.eventosFiltrados || []
      }
    },
    ArreglodeAsistentes:{
      get(){
        return this.$store.state.asistentesTodos || []
      }
    },
    ArreglodeFavoritos:{
      get(){
        return this.$store.state.favoritos || []
      }
    }
  }
});
</script>

<style scoped>
@media (min-width: 720px) {
  .Dialogo {
    width: 75%;
  }
}
@media (min-width: 1080px) {
  .Dialogo {
    width: 50%;
  }
}
</style>

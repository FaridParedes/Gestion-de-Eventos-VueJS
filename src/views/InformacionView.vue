<template>
  <Header />
  <div>
    <a class="text-h6 text-decoration-none text-blue" href="/">
     <v-icon icon="mdi-menu-left"></v-icon> Inicio
    </a>    
  </div>

  <div class="ma-8" align="center" v-show="cargandoEvento">
      <v-progress-circular
      :size="50"
      color="blue-darken-4"
      indeterminate
      ></v-progress-circular>
    </div>

    <div class="ma-8" align="center" v-show="errorCargarEvento">
    <v-card class="Dialogo text-center">
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


  <div class=" ma-8" v-show="eventoCargado">
    <div class=" elevation-6">
      <v-row>
        <v-col cols="12" sm="6" class="pa-10">
            <v-card class="bg-blue-lighten-5 mx-auto align-end">
              <div v-if="infoEvento.imagen != null">
                <div v-if="infoEvento.imagen.length == 0">
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
                <div v-else>
                  <v-carousel
                  height="200"
                  hide-delimiters
                  :show-arrows="infoEvento.imagen.length > 1 ? 'hover': false"
                  >
                    <v-carousel-item
                    v-for="(imagen,i) in infoEvento.imagen"
                    :key="i"
                    :src="imagen"
                    cover
                    ></v-carousel-item>
                  </v-carousel>
                </div>
              </div>

              <v-card-title>{{infoEvento.title}}</v-card-title>
              <v-card-subtitle>
                Organizador: {{ infoEvento.organizador + " " + infoEvento.organizadorLastName }}
              </v-card-subtitle>

              <v-divider class="mx-4 mb-1"></v-divider>

              <v-card-text>
                <div class="text-red">Inicia: {{ infoEvento.start }}</div>
                <div class="" v-if="infoEvento.allDay === 0">
                  Finaliza: {{ infoEvento.end }}
                </div>
                <div class="" v-if="infoEvento.allDay === 1">
                  Duración: Todo el día
                </div>
                <div class="" v-else >Duración: {{ infoEvento.session }} minutos </div>
                
                <div class="">Ubicación: {{ infoEvento.ubication }}</div>
                <div class="">Enlace: <a :href="infoEvento.enlace">{{ infoEvento.enlace }}</a> </div>
                <div class="text-gray"> Categoria: {{ infoEvento.categoria }}</div>
                <div clas="elevation-7">Descripción: {{ infoEvento.description }}</div>
              </v-card-text>
              <v-card-actions>
                <template v-if="this.$store.state.usuario.id === infoEvento.organizadorId">
                  <v-btn disabled color="orange-darken-4">
                    Eres el organizador
                  </v-btn>

                  <v-spacer></v-spacer>

                  <v-btn disabled color="red-darken-4" icon="mdi-heart-outline"></v-btn>

                </template>

                <template v-else>
                  <template v-for="asistente in ArreglodeAsistentes" :key="asistente.id">
                    <div v-if="infoEvento.id === asistente.eventoId && asistente.userId === this.$store.state.usuario.id">
                      <v-btn disabled color="orange-darken-4" prepend-icon="mdi-check">Asistente</v-btn>
                    </div>
                  </template>

                  <v-btn v-if="!usuarioEsAsistente(infoEvento)" color="orange-darken-4" @click="openAsistirForm(infoEvento)">Asistir</v-btn>

                  <v-spacer></v-spacer>

                  <template v-if="this.$store.state.session === true">
                      <div v-for="favorito in ArreglodeFavoritos" :key="favorito.id">
                        <div v-if="infoEvento.id === favorito.eventoId && favorito.userId === this.$store.state.usuario.id">
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
                      v-if="!eventoEsFavorito(infoEvento)"
                      :disabled="favLoading"
                      :loading="favLoading"
                      color="red-darken-4" 
                      icon="mdi-heart-outline"
                      @click="addFavoritos(infoEvento.id)"
                      ></v-btn>
                      
                  </template>

                </template>    
                


                <template :v-show="false">
                  <v-btn color="orange-darken-4" @click="openAsistirForm(infoEvento)" v-show="parametroAsitir"> Asistir </v-btn>
                  <v-btn disabled color="orange-darken-4" prepend-icon="mdi-check" v-show="parametroYaAsistir">Asistente</v-btn>

                  <v-spacer></v-spacer>
                  <v-btn v-if="miFavorito" color="red-darken-4" icon='mdi-heart' @click="deleteFavoritos(evento.id)"></v-btn>
                  <v-btn v-if="!miFavorito" color="red-darken-4" icon="mdi-heart-outline" @click="addFavoritos(evento.id)"></v-btn>

                </template>
                
              </v-card-actions>
            </v-card>
        </v-col>

        <v-col cols="12" sm="6" class="pa-10">

          <v-card height="500" class="">

            <!-- Cargando -->
            <v-card-text class="w-100" align="center" v-show="cargandoComentarios">
              <v-progress-circular
              :size="50"
              color="blue-darken-4"
              indeterminate
            ></v-progress-circular>
            </v-card-text>

            <v-card-text class="" align="center" v-show="noHayComentarios">
              <p>Aún no hay comentarios <v-icon icon="mdi-emoticon-sad"></v-icon> </p>
            </v-card-text>

            <!-- Comentarios cargados -->
            <v-card-text v-scroll.self="onScroll" class="h-100 mt-2 overflow-y-auto" v-show="comentariosCargados">
              <div class="elevation-1 mt-2" v-for="comentario in ArreglodeComentarios" :key="comentario.id">
                <div class="pa-1 d-flex">
                  <v-avatar class="align-self-center" v-if="comentario.usuarioFoto != null">
                    <v-img
                      :src="comentario.usuarioFoto"
                      alt="Avatar"
                    ></v-img>
                  </v-avatar>
                  <v-avatar class="align-self-center" v-else>
                    <v-img
                      src="https://scontent.fsal1-1.fna.fbcdn.net/v/t1.30497-1/143086968_2856368904622192_1959732218791162458_n.png?_nc_cat=1&ccb=1-7&_nc_sid=2b6aad&_nc_ohc=VhpHLgjZWbUAX9J5OE4&_nc_ht=scontent.fsal1-1.fna&oh=00_AfAoMoLHb4y-7KREtYTJJ7U-mzLSro9YlEokzhc9QL-agA&oe=655E86F8"
                      alt="Avatar"
                    ></v-img>
                  </v-avatar>
                    <div class="align-self-center pa-2">
                      {{ comentario.usuarioName }} {{ comentario.usuarioLastName }} <p class="font-weight-black" v-if="comentario.userId === infoEvento.organizadorId"> (Organizador)</p>
                    </div>
                </div>
                <div class="pa-1">
                  {{ comentario.comentario }}
                </div>
              </div>
            </v-card-text>
          </v-card>

          <div v-if="(this.$store.state.session === true && (usuarioEsAsistente(infoEvento))) || (this.$store.state.usuario.id === infoEvento.organizadorId)">
            <v-form class="mt-4" ref="formComentario">
              <v-row no-gutters>
                <v-col class="pa-2" cols="12" sm="9" align-self="center">
                  <v-textarea
                    rows="1"
                    variant="solo-inverted"
                    :counter="255"
                    v-model="comentario"
                    :rules="rulesDescripcion"
                    maxLength="255"
                    label="Escribe un comentario..."
                  ></v-textarea>
                </v-col>
                <v-col class="pa-2" cols="12" sm="3">
                  <v-btn color="blue-lighten-3" variant="elevated"  append-icon="mdi-send" @click="sendComentario"
                  >Comentar</v-btn>
                </v-col>
              </v-row>                
            </v-form> 
          </div>
          
          <div v-else align="center" class="font-weight-black"> Para comentar debes asistir al evento y estar registrado </div>
        
        </v-col>
      </v-row>
    </div>

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
                >Registrar Asistencia</v-btn>
            </v-col>
            <v-col>
              <v-btn
                block
                class="mb-2"
                color="gray"
                size="large"
                variant="tonal"
                @click="closeAsistirForm">
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
                  >Cerrar</v-btn>
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
                  >Cerrar</v-btn>
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
                  >Cerrar</v-btn>
              </v-card-actions>
            </v-card>
      </v-dialog>
      <!-- fin dialog alertas -->
    </v-dialog>
      <!-- Fin v-dialog para asistir a un evento -->
      <v-snackbar v-model="snackBarFalse" timeout="3000" color="red-darken-4">
      Hubo un error, intentalo más tarde.
      </v-snackbar>

  </div>
  <Footer />
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import axios from "axios";
export default {
  name: "InformacionView",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      eventId: this.$route.params.id,
      cargandoEvento: true,
      errorCargarEvento: false,
      eventoCargado: false,
      cargandoComentarios: true,
      noHayComentarios: false,
      comentariosCargados: false,
      dialog: false,
      cargando:false,
      carga:false,
      completada:false,
      error: false,
      errorExistencia: false,
      parametroAsitir: false,
      parametroYaAsistir: false,
      miFavorito:false,
      snackBarFalse: false,
      noFavLoading: false,
      favLoading: false,
      infoEvento: [],
      comentario: '',
      idFavorito: '',
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
      rulesDescripcion: [(v) => !!v || "El campo no debe estar vacío"],
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
    usuarioEsAsistente(evento) {
      return this.ArreglodeAsistentes.some(asistente => {
        return asistente.eventoId === evento.id && asistente.userId === this.$store.state.usuario.id;
      });
    },
    eventoEsFavorito(evento){
      return this.ArreglodeFavoritos.some(favorito => {
        return favorito.eventoId === evento.id && favorito.userId === this.$store.state.usuario.id;
      });
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
    openAsistirForm(evento){
      this.dialog = true;
      this.titleEvento = evento.title;
      this.idEvento = evento.id;
    },
    async sendComentario(){
      const {valid} = await this.$refs.formComentario.validate();
      if(valid){
          const comentarioObject={
            eventId: this.infoEvento.id,
            userId: this.$store.state.usuario.id,
            comentario: this.comentario,
            fecha: this.Registro.registro
          }
          axios.post('http://localhost:8000/api/comentario/new', comentarioObject,{
            headers: {
              Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
            },
          }).then(response=>{
            this.$store.dispatch('cargarComentarios', this.$route.params.id)
            this.$refs.formComentario.reset();
            this.$refs.formComentario.resetValidation();
            if(this.noHayComentarios){
              this.noHayComentarios = false;
            }
            console.log(response)
          }).catch(error=>{
            this.$refs.formComentario.reset();
            this.$refs.formComentario.resetValidation();
            console.log(error)
          })
      } else{
        this.snackBarFalse = true;
      }
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
          this.completada = true;
          
          this.$store.dispatch('cargarAsistentesTodos');
          this.$store.dispatch('cargarAsistentes', this.$route.params.id)
        }
        console.log(response)
      }).catch(error=>{
        this.carga = false;
        this.error = true;
        this.$store.dispatch('cargarAsistentesTodos');
        console.log(error)
      })
    },
    closeAsistirForm(){
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
      this.Registro.name = (this.$store.state.session) ? this.$store.state.usuario.name : "";
      this.Registro.lastName = (this.$store.state.session) ? this.$store.state.usuario.lastName : "";
      this.Registro.email = (this.$store.state.session) ? this.$store.state.usuario.email : "";
      this.Registro.userId = (this.$store.state.session) ? this.$store.state.usuario.id : null;
      this.dialog = false;
    },
    onScroll() {
      this.scrollInvoked++;
    },
  },
  beforeCreate() {
    this.cargandoEvento = true;
    axios
      .get("http://localhost:8000/api/event/show/" + this.$route.params.id)
      .then((response) => {
        this.infoEvento = response.data.data[0];
        this.cargandoEvento = false;
        this.eventoCargado = true;
      })
      .catch((error) => {
        this.cargandoEvento = false;
        this.errorCargarEvento = true;
        console.log(error);
      });

      this.$store.dispatch('cargarComentarios', this.$route.params.id)
      this.$store.dispatch('cargarAsistentes', this.$route.params.id)
      this.$store.dispatch('cargarAsistentesTodos');
      this.$store.dispatch('cargarFavoritos');
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
  
  watch:{
    ArreglodeComentarios(){
      if(this.ArreglodeComentarios != null){
        if(this.ArreglodeComentarios.length >0 ){
          this.cargandoComentarios = false;
          this.comentariosCargados = true;
        } else{
          this.cargandoComentarios = false;
          this.noHayComentarios = true;
        }
      }
    },
  },

  computed:{
    ArreglodeComentarios:{
      get(){
        return this.$store.state.comentarios || []
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
};
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
<template>
    <Header />
    <div>
      <a class="text-h6 text-decoration-none text-blue" href="/myevents">
        <v-icon icon="mdi-menu-left"></v-icon>
        Mis eventos
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

    <div class="ma-8" v-show="eventoCargado">
      <div class="elevation-6">
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
                  <div class="" v-else >Duración: {{infoEvento.session}} minutos </div>
                  
                  <div class="">Ubicación: {{ infoEvento.ubication }}</div>
                  <div class="">Enlace: <a :href="infoEvento.enlace">{{ infoEvento.enlace }}</a> </div>
                  <div class="text-gray"> Categoria: {{ infoEvento.categoria }}</div>
                  <div clas="elevation-7">Descripción: {{ infoEvento.description }}</div>

                </v-card-text>
                <v-card-actions>
                  <v-btn color="orange-darken-4" @click="openAsistentesList"> Asistentes </v-btn>

                  <v-spacer></v-spacer>

                  Compartir: 
                  <v-btn color="blue" icon="mdi-facebook" :href="'https://www.facebook.com/sharer.php?u=www.hoeu.com/event/'+this.eventId"></v-btn>
                  <v-btn color="red" icon="mdi-email-outline" @click="openCompartirCorreo"></v-btn>

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

            <div v-if="(this.$store.state.usuario.id === infoEvento.organizadorId)">
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
    </div>

    <!-- Dialog para ver asistentes -->
    <v-dialog class="Dialogo" v-model="dialogAsistentes">
      <v-card>
        <v-card-title>Lista de asistentes</v-card-title>
        
        <!-- Cargando -->
        <v-card-text class="w-100" align="center" v-show="cargandoAsistentes">
          <v-progress-circular
          :size="50"
          color="blue-darken-4"
          indeterminate
        ></v-progress-circular>
        </v-card-text>

        <v-card-text class="" align="center" v-show="noHayAsistentes">
          <p>Aún no hay asistentes <v-icon icon="mdi-emoticon-sad"></v-icon> </p>
        </v-card-text>

        <v-card-text v-show="asistentesCargados">
          <v-table density="compact" fixed-header height="300px">
            <thead>
              <tr>
                <th class="text-center">Nombre</th>
                <th class="text-center">Correo</th>
                <th class="text-center">Fecha de registro</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="asistente in ArreglodeAsistentes" :key="asistente.id">
                <td class="text-center">{{ asistente.name }} {{ asistente.lastName }}</td>
                <td class="text-center">{{ asistente.email }}</td>
                <td class="text-center">{{ asistente.registro }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
        
        <v-card-actions>
          <v-btn @click="cerrarDialogAsistentes"  variant="flat" color="red-lighten-1" prepend-icon="mdi-close">Cerrar</v-btn>
        </v-card-actions>
      
      
      
      </v-card>
    </v-dialog>
    <!--Fin dialog para ver asistentes  -->

    <!-- Dialog para Enviar Mails -->
    <v-dialog class="Dialogo"  v-model="dialogCorreo">
      <v-card>
        <v-card-title class="pa-6">Enviar mail de invitación</v-card-title>
        <v-card-text>
          <v-form ref="formCorreo">
            <v-text-field
              v-model="invitacion.mail"
              density="compact"
              :rules="[rulesMail, rulesMail2]"
              required
              placeholder="Correo electrónico"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-6">   
          <v-btn 
          color="blue-lighten-3"
          variant="elevated"
          append-icon="mdi-send"
          @Click="compartirCorreo"
          >Enviar</v-btn>
          <v-btn
          color="red-darken-4"
          variant="elevated"
          append-icon="mdi-cancel"
          @Click="cancelarCompartirCorreo"
          >Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Fin Dialog para Enviar Mails -->
    <!-- Dialog Alertas -->
    <v-dialog v-model="cargandoCorreo" width="auto" class="text-center">
      <v-card v-if="cargaCorreo">
        <v-card-text>
          <v-progress-circular
            indeterminate
            color="blue-darken-4"
          ></v-progress-circular>
        </v-card-text>
      </v-card>
      <v-card v-if="exitoCorreo" class="text-center">
        <v-card-text>
          <v-avatar size="200">
            <v-icon
              class="mb-6"
              color="success"
              icon="mdi-check-circle-outline"
              size="128"
            ></v-icon>
          </v-avatar>
          <p>Invitación enviada correctamente</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue-darken-4" block @click="cerrarCargandoCorreo"
            >Cerrar</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-if="errorCorreo" class="text-center">
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
          <v-btn color="blue-darken-4" block @click="cerrarCargandoCorreo"
            >Cerrar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--Fin Dialog Alertas -->
    <v-snackbar v-model="snackBarFalse" timeout="3000" color="red-darken-4">
      Hubo un error, intentalo más tarde.
      </v-snackbar>

    <Footer />
  </template>
  
  <script>
  import Header from "@/components/Header.vue";
  import Footer from "@/components/Footer.vue";
  import axios from "axios";
  export default {
    name: "GestionarView",
    components: {
      Header,
      Footer,
    },
    data() {
      return {
        eventId: this.$route.params.id,
        fechaSistema: '',
        //Cargar evento
        cargandoEvento: true,
        errorCargarEvento: false,
        eventoCargado: false,
        //alertas y dialog de asistentes
        dialogAsistentes: false,
        cargandoAsistentes: false,
        noHayAsistentes: false,
        asistentesCargados: false,
        //alertas y dialog correo
        dialogCorreo: false,
        cargandoCorreo: false,
        cargaCorreo: false,
        exitoCorreo: false,
        errorCorreo: false,
        //alertas comentarios
        cargandoComentarios: true,
        noHayComentarios: false,
        comentariosCargados: false,
        snackBarFalse: false,
        //Variables y reglas
        comentario: '',
        invitacion:{
          mail: '',
          enlace: 'http://localhost:8080/event/'+ this.$route.params.id,
        },
        infoEvento: [],
        rulesMail: value => !!value || 'Correo requerido.',
        rulesMail2: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Ingrese un correo valido.'
        },
        rulesDescripcion: [(v) => !!v || "El campo no debe estar vacío"],
      };
    },
    methods: {
      //Metodos para compartir
      openCompartirCorreo(){
        this.dialogCorreo = true;
      },

      cancelarCompartirCorreo(){
        this.dialogCorreo=false;
        this.$refs.formCorreo.reset();
        this.$refs.formCorreo.resetValidation();
      },

      async compartirCorreo(){
        this.cargandoCorreo = true;
        this.cargaCorreo = true;
        const {valid} = await this.$refs.formCorreo.validate();
        if(valid){
          const invitacionObject = {
            mail: this.invitacion.mail,
            enlace: this.invitacion.enlace
          }
          axios.post('http://localhost:8000/api/enviar/mail',invitacionObject,{
            headers: {
              Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
            },
          }).then(response=>{
            this.cargaCorreo = false;
            this.exitoCorreo = true;
            this.$refs.formCorreo.reset();
            this.$refs.formCorreo.resetValidation();
            console.log(response)
          }).catch(error=>{
            this.cargaCorreo = false;
            this.errorCorreo = true;
            console.log(error)
          })
        }
      },

      cerrarCargandoCorreo(){
        this.cargandoCorreo= false;
        if(this.exitoCorreo){
          this.exitoCorreo = false;
        }
        if(this.cargaCorreo){
          this.cargaCorreo = false
        }
        if(this.errorCorreo){
          this.errorCorreo = false
        }

      },

      //MEtodos para enviar comentarios
      async sendComentario(){
        const {valid} = await this.$refs.formComentario.validate();
        if(valid){
            const comentarioObject={
              eventId: this.infoEvento.id,
              userId: this.$store.state.usuario.id,
              comentario: this.comentario,
              fecha: this.fechaSistema
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

      //Metodo para ver la lista de asistentes
      openAsistentesList(){
        this.$store.dispatch('cargarAsistentes', this.$route.params.id)
        this.dialogAsistentes = true;
      },
      cerrarDialogAsistentes(){
        this.dialogAsistentes = false;
      },
      
      onScroll() {
        this.scrollInvoked++;
      },
    },

    beforeCreate() {
      if(this.$store.state.usuario.rol != "org" || this.$store.state.session === false){
        this.$router.push("/");
      }
      this.cargandoEvento = true;
      this.cargandoAsistentes = true;
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
    },
    created() {
      const fechaInicio = new Date();
      const year = fechaInicio.getFullYear();
      const month = String(fechaInicio.getMonth() + 1).padStart(2, "0");
      const day = String(fechaInicio.getDate()).padStart(2, "0");

      // Formatea la fecha en "yyyy-mm-dd hh:mm:ss"
      const fechaFormateada = `${year}-${month}-${day}`;
      this.fechaSistema = fechaFormateada;
    },

    watch:{
      ArreglodeComentarios(){
        if(this.ArreglodeComentarios != null){
          if(this.ArreglodeComentarios.length >0 ){
            this.cargandoComentarios = false;
            if(this.noHayComentarios){
              this.noHayComentarios = false;
            }
            this.comentariosCargados = true;
          } else{
            this.cargandoComentarios = false;
            this.noHayComentarios = true;
          }
        }
      },
      ArreglodeAsistentes(){
        let arrayPrueba = this.ArreglodeAsistentes;
        if(arrayPrueba != null){
          if(arrayPrueba.length > 0){
            this.cargandoAsistentes = false;
            if(this.noHayAsistentes){
              this.noHayAsistentes = false;
            }
            this.asistentesCargados = true;
          } else {
            this.cargandoAsistentes = false;
            this.noHayAsistentes = true;
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
          return this.$store.state.asistentes || []
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
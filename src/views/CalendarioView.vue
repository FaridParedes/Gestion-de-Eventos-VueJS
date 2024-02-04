<template>
  <Header></Header>
  <h2 class="ma-8">Mi Calendario de Eventos</h2>
  <div class="text-subtitle-1 ml-8">
    Para añadir un evento haz click en el día deseado (vista mensual) y
    selecciona la hora (vista semanal). Opción disponible solo para
    organizadores.
  </div>
  <Calendario @dateClick="opendateClick" />
  <v-dialog class="Dialogo" v-model="dialog">
    <v-card
      v-scroll.self="onScroll"
      class="h-75 overflow-y-auto micard"
      title="Crear Evento"
    >
      <v-form ref="form">
        <v-card-text>
          <v-text-field
            :counter="100"
            v-model="form.title"
            :rules="rulesTitle"
            maxLength="100"
            required
            label="Título *"
          ></v-text-field>

          <v-textarea
            rows="2"
            :counter="255"
            v-model="form.description"
            :rules="rulesDescripcion"
            maxLength="255"
            label="Descripción *"
          ></v-textarea>

          <v-text-field
            type="date"
            v-model="form.date_at"
            label="Fecha Inicio *"
            :rules="rulesDate"
            required
          ></v-text-field>

          <div>
            <div class="text-subtitle-1 text-medium-emphasis">Duración</div>
            <v-checkbox v-model="form.allDay" label="Todo el día"></v-checkbox>

            <v-row>
              <v-col sm="6">
                <v-text-field
                  v-model="form.hour"
                  type="time"
                  :disabled="form.allDay"
                  label="Hora Inicio *"
                  :rules="rulesHour"
                  required
                ></v-text-field>
              </v-col>
              <v-col sm="6">
                <v-text-field
                  v-model="form.session"
                  :disabled="form.allDay"
                  type="number"
                  :rules="rulesTime"
                  label="Duración (en minutos) *"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </div>

          <v-select
            label="Seleccione una categoria *"
            v-model="form.categoriaId"
            :rules="rulesCategoria"
            :items="this.$store.getters.getCategorias"
            item-title="name"
            item-value="id"
            required
          ></v-select>

          <v-text-field
            v-model="form.ubication"
            :counter="25"
            maxLength="25"
            :rules="rulesUbicacion"
            label="Ubicación *"
          ></v-text-field>

          <v-text-field
            v-model="form.enlace"
            :rules="rulesEnlace"
            label="Adjuntar enlace *"
          ></v-text-field>

          <v-file-input
            v-model="imagenes"
            v-on:change="cargarFoto"
            :rules="reglasImg"
            accept="image/png, image/jpeg, image/bmp"
            prepend-icon="mdi-camera"
            label="Sube una o más imagenes"
            multiple
          ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-btn
            variant="elevated"
            class="me-2"
            color="success"
            @Click.prevent="saveEvent(form)"
          >
            <v-icon start icon="mdi-checkbox-marked-circle"></v-icon>
            Guardar
          </v-btn>
          <v-btn
            variant="elevated"
            class="ma-2"
            color="gray"
            @Click="closeForms"
          >
            <v-icon start icon="mdi-minus-circle"></v-icon>
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
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
          <p>Evento agregado correctamente</p>
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
            >Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>

  <v-snackbar v-model="fechaAnteriorSB" timeout="5000" color="red-darken-4">
      La fecha de inicio no puede ser anterior a la fecha actual.
    </v-snackbar>

  <Footer />
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Calendario from "@/components/Calendario.vue";
import axios from 'axios';

export default {
  name: "CalendarioView",
  data() {
    return {
      cargando: false,
      carga: false,
      completada: false,
      error: false,
      dialog: false,
      fechaAnteriorSB: false,
      imagenes: [],
      form: {
        title: "",
        description: "",
        date_at: "",
        allDay: "",
        hour: "",
        start: "",
        end: "",
        session: "",
        categoriaId: "",
        estadoId: "",
        ubication: "",
        enlace: "",
        imagenes: [],
        organizadorId: this.$store.getters.getUsuario.id,
      },
      rulesTitle: [
        (v) => !!v || "Título requerido",
        (v) =>
          (v && v.length <= 100) ||
          "El título debe tener menos de 100 caracteres",
      ],
      rulesDate: [(v) => !!v || "Fecha requerida"],
      rulesCategoria: [(v) => !!v || "Categoria requerida"],
      rulesEnlace: [(v) => !!v || "Enlace requerido"],
      rulesUbicacion: [(v) => !!v || "Ubicacion requerida"],
      rulesDescripcion: [(v) => !!v || "Descripcion requerida"],
      reglasImg: [
        (value) => {
          return (
            !value ||
            !value.length ||
            value[0].size < 6000000 ||
            "Image size should be less than 6 MB!"
          );
        },
      ],
    };
  },
  components: {
    Header,
    Calendario,
    Footer,
  },
  methods: {
    opendateClick(arg) {
      if (this.$store.getters.getUsuario.rol === "org") {
        this.dialog = true;
        this.setFormsOpen(arg);
        //console.log("Recibiendo datos:", arg);
      }
    },
    closeForms() {
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
      this.form.imagenes = [];
      this.dialog = false;
    },
    cerrarCargando() {
      this.completada = false;
      this.cargando = false;
      if (this.error) {
        this.error = false;
      }
      this.closeForms();
      this.$forceUpdate();
    },
    setFormsOpen(obj) {
      if (obj.allDay === true) {
        this.form.allDay = true;
        this.hourDisable = true;
        this.sessionDisable = true;
        this.form.date_at = obj.dateStr;

        return;
      } else if (obj.allDay === false) {
        this.form.allDay = false;
        this.hourDisable = false;
        this.sessionDisable = false;
        let dateAndTime = obj.dateStr.split("T");
        console.log(dateAndTime);
        this.form.date_at = dateAndTime[0];
        this.form.hour = dateAndTime[1].substr(0, 8);

        return;
      }
    },

    cargarFoto() {
      if (this.imagenes.length > 0) {
        this.form.imagenes = [];
        for (let i = 0; i < this.imagenes.length; i++) {
          let reader = new FileReader();
          let dataFoto = "";
          reader.readAsDataURL(this.imagenes[i]);
          reader.onload = () => {
            dataFoto = reader.result;
            this.form.imagenes.push(dataFoto);
          };
        }
      }
    },
    async saveEvent(param) {
      this.cargando = true;
      this.carga = true;
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        let fechaActual = new Date();
        if (param.enlace.length === 0) {
          param.enlace = "";
        }
        if (param.imagenes.length === 0) {
          param.imagenes = [];
        }
        if (param.allDay) {
          param.hour = "00:00:00";
          param.session = 0;
          let fechaParam = new Date(param.date_at + "T00:00:00-0600");
          if (fechaActual < fechaParam) {
            param.estadoId = 1;
          } else if (
            fechaActual.getFullYear() === fechaParam.getFullYear() &&
            fechaActual.getMonth() === fechaParam.getMonth() &&
            fechaActual.getDate() === fechaParam.getDate()
          ) {
            param.estadoId = 2;
          } else {
            param.estadoId = 3;
          }
          param.start = param.date_at + " " + "00:00:00";
          param.end = param.date_at + " " + "23:59:00";

          const eventoObject = {
            title: param.title,
            description: param.description,
            allDay: param.allDay,
            start: param.start,
            end: param.end,
            session: param.session,
            ubication: param.ubication,
            enlace: param.enlace,
            categoriaId: param.categoriaId,
            estadoId: param.estadoId,
            organizadorId: param.organizadorId,
            imagenes: param.imagenes,
          };
          await axios.post('http://localhost:8000/api/events/new',eventoObject,{
            headers:{
              Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
            }
          })
          .then(response =>{
            this.carga = false;
            this.completada = true;
            this.$store.dispatch('cargarMyEventsCalendar');
            this.$refs.form.reset();
              this.$refs.form.resetValidation();
              this.form.allDay = true;
              this.form.imagenes = [];
              if(response.data.mensaje === "fechaAnterior"){
                this.cargando = false;
                this.carga = false;
                this.completada = false;
                this.error = false;
                this.fechaAnteriorSB = true;
                this.dialog=false
              }
            console.log(response);
          }).catch (error =>{
            this.$refs.form.reset();
            this.$refs.form.resetValidation();
            this.form.allDay = true;
            this.form.imagenes = [];
            this.carga = false;
            this.error = true;
            console.log("Hubo error en axios", error)
          })

        } else {
          param.start = param.date_at + " " + param.hour;
          param.date_at = param.date_at + "T" + param.hour;
          param.session = parseInt(param.session);
          let fechaParam = new Date(param.date_at + "-0600");
          if (fechaActual < fechaParam) {
            param.estadoId = 1;
          } else if (
            fechaActual.getFullYear() === fechaParam.getFullYear() &&
            fechaActual.getMonth() === fechaParam.getMonth() &&
            fechaActual.getDate() === fechaParam.getDate() &&
            fechaActual.getHours() === fechaParam.getHours() &&
            fechaActual.getMinutes() === fechaParam.getMinutes()
          ) {
            param.estadoId = 2;
          } else {
            param.estadoId = 3;
          }

          const sessionSegundos = param.session * 60;
          let fechaInicio = new Date(param.start);
          const getSecondSession = fechaInicio.getSeconds() + sessionSegundos;
          fechaInicio.setSeconds(getSecondSession);

          const year = fechaInicio.getFullYear();
          const month = String(fechaInicio.getMonth() + 1).padStart(2, "0"); 
          const day = String(fechaInicio.getDate()).padStart(2, "0"); 
          const hours = String(fechaInicio.getHours()).padStart(2, "0"); 
          const minutes = String(fechaInicio.getMinutes()).padStart(2, "0"); 
          const seconds = String(fechaInicio.getSeconds()).padStart(2, "0"); 

          // Formatea la fecha en "yyyy-mm-dd hh:mm:ss"
          const fechaFormateada = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

          param.end = fechaFormateada;

          const eventoObject = {
            title: param.title,
            description: param.description,
            allDay: param.allDay,
            start: param.start,
            end: param.end,
            session: param.session,
            ubication: param.ubication,
            enlace: param.enlace,
            categoriaId: param.categoriaId,
            estadoId: param.estadoId,
            organizadorId: param.organizadorId,
            imagenes: param.imagenes,
          };

          await axios.post('http://localhost:8000/api/events/new',eventoObject,{
            headers:{
              Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
            }
          })
          .then(response =>{
            this.carga = false;
            this.completada = true;
            this.$store.dispatch('cargarMyEventsCalendar');
            this.$refs.form.reset();
            this.$refs.form.resetValidation();
            this.form.allDay = true;
            this.form.imagenes = [];
            if(response.data.mensaje === "fechaAnterior"){
              this.cargando = false;
              this.carga = false;
              this.completada = false;
              this.error = false;
              this.fechaAnteriorSB = true;
              this.dialog=false
            }
            console.log(response)
          }).catch (error =>{
            this.$refs.form.reset();
            this.$refs.form.resetValidation();
            this.form.allDay = true;
            this.form.imagenes = [];
            this.carga = false;
            this.error = true;
            console.log("Hubo error en axios", error)
          })

        }
        //console.log("Esto estas enviando macizo: ", param);
      }else {
        this.carga = false;
        this.cargando = false;
      }

      this.$forceUpdate();
    },
    onScroll() {
      this.scrollInvoked++;
    },
  },
  async beforeCreate() {
    if ((await this.$store.getters.getSession) === false) {
      this.$router.push("/");
    }
    this.$store.dispatch("cargarMyEvents");
  },
  computed: {
    rulesHour() {
      return [
        (v) => {
          if (!this.form.allDay) {
            return !!v || "Hora inicio requerida";
          }
          return true;
        },
      ];
    },
    rulesTime() {
      return [
        (v) => {
          if (!this.form.allDay) {
            return !!v || "Duración requerida";
          }
          return true;
        },
      ];
    },
  },
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

.Alerta {
  /* Opacidad del fondo */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 50%;
  z-index: 100; /* Z-index alto para superponer otros elementos */
}
</style>

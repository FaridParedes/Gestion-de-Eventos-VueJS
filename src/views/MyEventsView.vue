<template>
  <Header></Header>
  <div class="w-100 h-75" align="center" v-show="cargandoPaginaMisEventos">
    <v-progress-circular
      class="h-100"
      :size="100"
      :width="7"
      color="blue-darken-4"
      indeterminate
    ></v-progress-circular>
  </div>

  <div v-show="paginaMisEventos" class="ma-8">
    <!-- Filtros y agregar evento -->
    <div><h1>Mis Eventos</h1></div>
    Filtrar eventos por:
    <v-form ref="formFiltro">
      <v-row>
        <v-col cols="12" md="3">
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
        <v-col cols="12" md="3">
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
        <!-- Boton para filtrar y Agregar evento -->
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
        <v-col md="2">
          <v-btn
            block
            size="x-large"
            color="blue-darken-4"
            class="mb-4"
            @Click="openNuevoEvento"
            ><v-icon icon="mdi-calendar-plus"></v-icon
          ></v-btn>
        </v-col>
      </v-row>
    </v-form>
    <!-- Filtros y agregar evento FIn -->

    <!-- Inicio v-card Cargando -->
    <div
      class="elevation-6 pa-5 rounded-lg"
      height="100"
      v-show="barraCargando"
    >
      <v-row>
        <v-col>
          <v-card class="mx-auto align-end text-black w-100">
            Cargando tus eventos...
            <v-progress-linear
              indeterminate
              color="blue-darken-4"
            ></v-progress-linear>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <!-- Fin v-card Cargando -->

    <!-- Inicio v-card Con Eventos -->
    <div class="elevation-6 rounded-lg" v-show="eventosCargados">
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
              <v-spacer></v-spacer>

              <v-btn variant="text" color="blue" icon="mdi-eye-plus"
              :to="`/myevents/${evento.id}`"
              ></v-btn>
              <v-btn
                variant="text"
                color="blue-darken-4"
                icon="mdi-pencil"
                @click="openModificarForm(evento)"
              ></v-btn>
              <v-btn
                variant="text"
                color="red-darken-4"
                icon="mdi-delete"
                @click="openDialogEliminar(evento.id)"
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
    <!-- Final v-card con Eventos -->

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
              <v-spacer></v-spacer>

              <v-btn variant="text" color="blue" icon="mdi-eye-plus"
              :to="`/myevents/${evento.id}`"
              ></v-btn>
              <v-btn
                variant="text"
                color="blue-darken-4"
                icon="mdi-pencil"
                @click="openModificarForm(evento)"
              ></v-btn>
              <v-btn
                variant="text"
                color="red-darken-4"
                icon="mdi-delete"
                @click="openDialogEliminar(evento.id)"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <!-- Fin v-card de eventos filtrados -->


    <!-- Inicio v-dialog para modificar evento -->
    <v-dialog class="Dialogo" v-model="modificarEventoForm">
      <v-card class="h-75 overflow-y-auto micard" title="Modificar Evento">
        <v-form ref="formModificar">
          <v-card-text>
            <v-text-field
              :counter="100"
              v-model="mod.title"
              :rules="rulesTitle"
              maxLength="100"
              required
              label="Título *"
            ></v-text-field>

            <v-textarea
              rows="2"
              :counter="255"
              v-model="mod.description"
              :rules="rulesDescripcion"
              maxLength="255"
              label="Descripción *"
            ></v-textarea>

            <v-text-field
              type="date"
              v-model="mod.date_at"
              label="Fecha Inicio *"
              :rules="rulesDate"
              required
            ></v-text-field>

            <div>
              <div class="text-subtitle-1 text-medium-emphasis">Duración</div>
              <v-checkbox v-model="mod.allDay" label="Todo el día"></v-checkbox>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="mod.hour"
                    type="time"
                    :disabled="mod.allDay"
                    label="Hora Inicio *"
                    :rules="rulesHour"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="mod.session"
                    :disabled="mod.allDay"
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
              v-model="mod.categoriaId"
              :rules="rulesCategoria"
              :items="this.$store.getters.getCategorias"
              item-title="name"
              item-value="id"
              required
            ></v-select>

            <v-text-field
              v-model="mod.ubication"
              :counter="25"
              maxLength="25"
              :rules="rulesUbicacion"
              label="Ubicación *"
            ></v-text-field>

            <v-text-field
              v-model="mod.enlace"
              :rules="rulesEnlace"
              label="Adjuntar enlace *"
            ></v-text-field>

            <div v-if="mod.imagenesOld.length > 0">
              <v-row>
                <v-col
                  cols="6"
                  md="4"
                  v-for="(imagen, i) in mod.imagenesOld"
                  :key="i"
                >
                  <v-card variant="flat">
                    <v-card-text align="center">
                      <v-img
                        :width="100"
                        :height="70"
                        cover
                        :src="imagen"
                      ></v-img>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        block
                        color="red"
                        icon="mdi-delete"
                        @Click="eliminarImagen(imagen)"
                      ></v-btn>
                      <v-snackbar
                        v-model="snackBar"
                        timeout="3000"
                        color="blue-lighten-3"
                      >
                        Imagen almacenada, se borrará al hacer click en
                        "Guardar".
                      </v-snackbar>
                      <v-snackbar
                        v-model="snackBarFalse"
                        timeout="3000"
                        color="red-darken-4"
                      >
                        Imagen ya fue seleccionada.
                      </v-snackbar>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </div>

            <v-file-input
              v-model="imagenesMod"
              v-on:change="cargarFotoModificar"
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
              @Click.prevent="modificarEvento(form)"
            >
              <v-icon start icon="mdi-checkbox-marked-circle"></v-icon>
              Guardar
            </v-btn>
            <v-btn
              variant="elevated"
              class="ma-2"
              color="gray"
              @Click="cerrarModificarForm"
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
            <p>Evento modificado correctamente</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue-darken-4" block @click="cerrarCargandoMod"
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
            <v-btn color="blue-darken-4" block @click="cerrarCargandoMod"
              >Cerrar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-dialog>
    <!-- Fin v-dialog modifica evento -->

    <!-- Inicio v-card no se encontraron eventos -->
    <div class="elevation-6 pa-5 rounded-lg" height="100" v-show="errorCargado">
      <v-row>
        <v-col>
          <v-card class="mx-auto align-end text-black" max-width="400">
            <v-card-title> No se encontraron eventos </v-card-title>
            <v-card-subtitle>
              Haz click en el boton para crear uno nuevo</v-card-subtitle
            >
            <v-card-text>
              <v-btn
                prepend-icon="mdi-calendar-plus"
                color="blue-darken-4"
                @click="openNuevoEvento"
                >Agregar evento</v-btn
              >
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <!-- Final v-card no se encontraron eventos -->

    <!-- Inicio v-dialog para crear eventos -->
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
              <v-checkbox
                v-model="form.allDay"
                label="Todo el día"
              ></v-checkbox>

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
              >Cerrar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-dialog>
    <!-- Final v-dialog para crear eventos -->

    <v-snackbar v-model="snackBarEliminarEvento" timeout="3000" color="blue-lighten-3">
      Evento Eliminado correctamente.
    </v-snackbar>
    <v-snackbar v-model="snackBarFalseEliminarEvento" timeout="3000" color="red-darken-4">
      Hubo un error, intentalo más tarde.
    </v-snackbar>

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
            <p>¿Seguro que desea eliminar el evento?</p>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="flat" color="green" prepend-icon="mdi-check" @click="eliminarEvento">Aceptar</v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="red" prepend-icon="mdi-close" @Click="closeDialogEliminar">Cancelar</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

  <v-snackbar v-model="snackBarFalseNoHayEventos" timeout="3000" color="red-darken-4">
      No se encontrarón eventos con los filtros seleccionado.
  </v-snackbar>
  <v-snackbar v-model="snackBarFalseErrorFiltro" timeout="3000" color="red-darken-4">
      Hubo un error, intentalo más tarde.
    </v-snackbar>

    <v-snackbar v-model="fechaAnteriorSB" timeout="5000" color="red-darken-4">
      La fecha de inicio no puede ser anterior a la fecha actual.
    </v-snackbar>

  <Footer />
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import axios from "axios";

export default {
  name: "MyEventsView",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      eventosCargados: false,
      barraCargando: true,
      errorCargado: false,
      dialog: false,
      cargando: false,
      carga: false,
      completada: false,
      error: false,
      modificarEventoForm: false,
      snackBar: false,
      snackBarFalse: false,
      snackBarEliminarEvento: false,
      snackBarFalseEliminarEvento: false,
      paginaMisEventos: false,
      cargandoPaginaMisEventos: true,
      seguroEliminar:false,
      snackBarFalseNoHayEventos: false,
      snackBarFalseErrorFiltro: false,
      eventosFiltradosCargados: false,
      loading:false,
      loading2:false,
      fechaAnteriorSB: false,
      categoriaSeleccionada: [],
      ubicacionSeleccionada: [],
      fechaSeleccionada: '',
      imagenes: [],
      imagenesMod: [],
      imagenesBorrar: [],
      saveIdDelete: '',
      form: {
        title: "",
        description: "",
        date_at: "",
        allDay: true,
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
      mod: {
        id: "",
        title: "",
        description: "",
        date_at: "",
        allDay: true,
        hour: "",
        start: "",
        end: "",
        session: "",
        categoriaId: "",
        estadoId: "",
        ubication: "",
        enlace: "",
        imagenesOld: [],
        imagenes: [],
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
  methods: {
    openNuevoEvento() {
      this.dialog = true;
    },

    openDialogEliminar(id){
      this.saveIdDelete = id;
      this.seguroEliminar = true;
    },

    closeDialogEliminar(){
      this.seguroEliminar = false;
      this.saveIdDelete = '';
    },

    openModificarForm(evento) {
      this.modificarEventoForm = true;
      this.mod.id = evento.id;
      axios
        .get("http://localhost:8000/api/events/show/" + this.mod.id, {
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("token")),
          },
        })
        .then((response) => {
          let data = response.data.data;
          this.mod.id = data.id;
          this.mod.title = data.title;
          this.mod.description = data.description;
          this.mod.session = data.session;
          this.mod.categoriaId = data.categoriaId;
          this.mod.estadoId = data.estadoId;
          this.mod.ubication = data.ubication;
          this.mod.enlace = data.enlace;
          this.mod.imagenesOld = data.imagenes;
          this.mod.organizadorId = data.organizadorId;
          if (data.allDay === 0) {
            this.mod.allDay = false;
            let dateAndTime = data.start.split(" ");
            this.mod.date_at = dateAndTime[0];
            this.mod.hour = dateAndTime[1];
          } else {
            this.mod.allDay = true;
            let dateAndTime = data.start.split(" ");
            this.mod.date_at = dateAndTime[0];
          }
        })
        .catch((error) => {
          console.log("Hubo un error:c", error);
        });
    },

    async modificarEvento() {
      this.cargando = true;
      this.carga = true;
      const { valid } = await this.$refs.formModificar.validate();
      this.mod.imagenesBorrar = [];
      this.mod.imagenesBorrar = this.imagenesBorrar;
      if (valid) {
        if (this.mod.allDay) {
          this.mod.start = this.mod.date_at + " " + "00:00:00";
          this.mod.end = this.mod.date_at + " " + "23:59:00";
          this.mod.session = 0;
          this.mod.estadoId = 1;

          const eventoObject = {
            id: this.mod.id,
            title: this.mod.title,
            description: this.mod.description,
            allDay: this.mod.allDay,
            start: this.mod.start,
            end: this.mod.end,
            session: this.mod.session,
            ubication: this.mod.ubication,
            enlace: this.mod.enlace,
            categoriaId: this.mod.categoriaId,
            estadoId: this.mod.estadoId,
            organizadorId: this.mod.organizadorId,
            imagenes: this.mod.imagenes,
            imagenesBorrar: this.mod.imagenesBorrar,
          };

          axios
            .put(
              "http://localhost:8000/api/events/update/" + this.mod.id,
              eventoObject,
              {
                headers: {
                  Authorization:
                    "Bearer " + JSON.parse(localStorage.getItem("token")),
                },
              }
            )
            .then((response) => {
              this.carga = false;
              this.completada = true;
              this.imagenesBorrar = [];
              this.$store.dispatch("cargarMyEvents", 0);
              this.$refs.formModificar.reset();
              this.$refs.formModificar.resetValidation();
              if(response.data.mensaje === "fechaAnterior"){
                this.cargando = false;
                this.carga = false;
                this.completada = false;
                this.error = false;
                this.fechaAnteriorSB = true;
                this.modificarEventoForm = false;
              }
            })
            .catch((error) => {
              this.carga = false;
              this.error = true;
              console.log(error);
            });
        } else {
          this.mod.start = this.mod.date_at + " " + this.mod.hour;
          this.mod.session = parseInt(this.mod.session);
          this.mod.estadoId = 1;

          const sessionSegundos = this.mod.session * 60;
          let fechaInicio = new Date(this.mod.start);
          const getSecondSession = fechaInicio.getSeconds() + sessionSegundos;
          fechaInicio.setSeconds(getSecondSession);

          const year = fechaInicio.getFullYear();
          const month = String(fechaInicio.getMonth() + 1).padStart(2, "0");
          const day = String(fechaInicio.getDate()).padStart(2, "0");
          const hours = String(fechaInicio.getHours()).padStart(2, "0");
          const minutes = String(fechaInicio.getMinutes()).padStart(2, "0");
          const seconds = String(fechaInicio.getSeconds()).padStart(2, "0");

          const fechaFormateada = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

          this.mod.end = fechaFormateada;

          const eventoObject = {
            id: this.mod.id,
            title: this.mod.title,
            description: this.mod.description,
            allDay: this.mod.allDay,
            start: this.mod.start,
            end: this.mod.end,
            session: this.mod.session,
            ubication: this.mod.ubication,
            enlace: this.mod.enlace,
            categoriaId: this.mod.categoriaId,
            estadoId: this.mod.estadoId,
            organizadorId: this.mod.organizadorId,
            imagenes: this.mod.imagenes,
            imagenesBorrar: this.mod.imagenesBorrar,
          };

          axios.put("http://localhost:8000/api/events/update/" + this.mod.id,eventoObject,
              {
                headers: {
                  Authorization:
                    "Bearer " + JSON.parse(localStorage.getItem("token")),
                },
              }
            )
            .then((response) => {
              this.carga = false;
              this.completada = true;
              this.imagenesBorrar = [];
              this.$store.dispatch("cargarMyEvents", 0);
              this.$refs.formModificar.reset();
              this.$refs.formModificar.resetValidation();
              if(response.data.mensaje === "fechaAnterior"){
                this.cargando = false;
                this.carga = false;
                this.completada = false;
                this.error = false;
                this.fechaAnteriorSB = true;
                this.modificarEventoForm = false;
              }
            })
            .catch((error) => {
              this.carga = false;
              this.error = true;
              console.log(error);
            });
        }
      } else {
        this.carga = false;
        this.error = true;
      }
    },

    async eliminarEvento() {
      axios.delete("http://localhost:8000/api/events/destroy/" + this.saveIdDelete, {
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("token")),
          },
        })
        .then((response) => {
          this.saveIdDelete = ''
          this.seguroEliminar = false;
          this.snackBarEliminarEvento = true;
          this.$store.dispatch("cargarMyEvents", 0);
          console.log(response);
        })
        .catch((error) => {
          this.carga = false;
          this.cargando = false;
          this.snackBarFalseEliminarEvento = true;
          console.log(error);
        });
    },

    eliminarImagen(imagen) {
      let i = 0;
      if (this.imagenesBorrar.length > 0) {
        this.imagenesBorrar.forEach((img) => {
          if (img === imagen) {
            i++;
          }
        });
        if (i === 0) {
          this.imagenesBorrar.push(imagen);
          this.snackBar = true;
        } else {
          this.snackBarFalse = true;
        }
      } else {
        this.imagenesBorrar.push(imagen);
        this.snackBar = true;
      }
    },

    closeForms() {
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
      this.form.imagenes = [];
      this.form.allDay = true;
      this.dialog = false;
    },

    cerrarCargandoMod() {
      this.completada = false;
      this.cargando = false;
      if (this.error) {
        this.error = false;
      }
      this.cerrarModificarForm();
    },

    cerrarCargando() {
      this.completada = false;
      this.cargando = false;
      if (this.error) {
        this.error = false;
      }
      this.closeForms();
    },

    cerrarModificarForm() {
      this.modificarEventoForm = false;
      this.$refs.formModificar.reset();
      this.$refs.formModificar.resetValidation();
      this.mod.imagenes = [];
    },

    cargarFotoModificar() {
      if (this.imagenesMod != null) {
        if (this.imagenesMod.length > 0) {
          this.mod.imagenes = [];
          for (let i = 0; i < this.imagenesMod.length; i++) {
            let reader = new FileReader();
            let dataFoto = "";
            reader.readAsDataURL(this.imagenesMod[i]);
            reader.onload = () => {
              dataFoto = reader.result;
              this.mod.imagenes.push(dataFoto);
            };
          }
        }
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
          await axios
            .post("http://localhost:8000/api/events/new", eventoObject, {
              headers: {
                Authorization:
                  "Bearer " + JSON.parse(localStorage.getItem("token")),
              },
            })
            .then((response) => {
              this.carga = false;
              this.completada = true;
              this.$store.dispatch("cargarMyEvents", 0);
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
                this.dialog=false;
              }
              console.log(response);
            })
            .catch((error) => {
              this.$refs.form.reset();
              this.$refs.form.resetValidation();
              this.form.allDay = true;
              this.form.imagenes = [];
              this.carga = false;
              this.error = true;
              console.log("Hubo error en axios", error);
            });
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

          await axios
            .post("http://localhost:8000/api/events/new", eventoObject, {
              headers: {
                Authorization:
                  "Bearer " + JSON.parse(localStorage.getItem("token")),
              },
            })
            .then((response) => {
              this.carga = false;
              this.completada = true;
              this.$store.dispatch("cargarMyEvents", 0);
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
                this.dialog=false;
              }
              console.log(response);
            })
            .catch((error) => {
              this.$refs.form.reset();
              this.$refs.form.resetValidation();
              this.form.allDay = true;
              this.form.imagenes = [];
              this.carga = false;
              this.error = true;
              console.log("Hubo error en axios", error);
            });
        }
      } else {
        this.carga = false;
        this.cargando = false;
      }
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
        fecha: null,
        userId: this.$store.state.usuario.id
      }
      if(this.categoriaSeleccionada){
        filtros.categoriasId = this.categoriaSeleccionada
      } if(this.ubicacionSeleccionada){
        filtros.ubicaciones = this.ubicacionSeleccionada
      }if(this.fechaSeleccionada){
        filtros.fecha = this.fechaSeleccionada
      }
      axios.post('http://localhost:8000/api/user/events/filter', filtros,{
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("token")),
        },
      })
      .then(response=>{
        console.log(response)
        if(response.data.code === 200){
          this.$store.commit('setMisEventosFiltrados', response.data.data);
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
    onScroll() {
      this.scrollInvoked++;
    },

    paginatePage(pageNumber) {
      this.$store.dispatch("cargarMyEvents", pageNumber);
    },
  },

  async beforeCreate() {
    let session = JSON.parse(localStorage.getItem("session"));
    if ((await session) != "true") {
      this.$router.push("/");
    } else {
      const response = await axios.get("http://localhost:8000/api/user", {
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
        },
      });
      this.$store.dispatch("cargarCategorias");
      this.$store.dispatch("cargarEstados");
      this.$store.dispatch("cargarUsuario", response.data);
      this.$store.dispatch("cargarMyEvents", 0);
      this.$store.dispatch("cargarUbicaciones");
    }
  },

  async created() {
    if(this.$store.state.usuario.rol === "asi"){
        this.$router.push("/");
    } else{
      this.cargandoPaginaMisEventos = false;
      this.paginaMisEventos = true;
    }
  },

  async mounted() {

  },

  watch: {
    currentPage(newVal) {
      this.paginatePage(newVal);
    },
    ArreglodeEventos() {
      if (this.ArreglodeEventos.length === 0) {
        this.barraCargando = false;
        this.errorCargado = true;
      } else {
        this.barraCargando = false;
        this.eventosCargados = true;
        if (this.errorCargado === true) {
          this.errorCargado = false;
        }
      }
    },
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
    currentPage: {
      get() {
        return this.$store.state.myevents.current_page;
      },
      set(value) {
        this.$store.commit("setCurrentPageMyEvents", value);
      },
    },
    lastPage: {
      get() {
        return this.$store.state.myevents.last_page;
      },
    },
    ArreglodeEventos: {
      get() {
        return this.$store.state.myevents.data || [];
      },
    },
    arregloEventosFiltrados:{
      get(){
        return this.$store.state.misEventosFiltrados || []
      }
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
</style>

<template>
  <v-dialog :v-model="dialogo">
    <v-card
      v-scroll.self="onScroll"
      class="h-75 overflow-y-auto micard"
      title="Crear Evento"
      variant="tonal"
    >
      <v-card-text>
        <v-alert
          type="error"
          title="Error al iniciar sesión"
          text="El correo o la contraseña son incorrectas"
          v-model="alert"
          :closable="alert"
        ></v-alert>
        <form>
          <v-text-field
            :v-model="form.title"
            :counter="20"
            :rules="reglas2"
            label="Título *"
            required
          ></v-text-field>

          <v-textarea
            :v-model="form.description"
            rows="2"
            label="Descripción"
          ></v-textarea>

          <v-text-field
            :v-model="form.date_at"
            type="date"
            label="Fecha Inicio *"
            :rules="reglas2"
            :disabled="fechaDisable"
          ></v-text-field>

          <v-row>
            <v-col sm="6">
              <v-text-field
                :v-model="form.hour"
                type="time"
                label="Hora Inicio *"
              ></v-text-field>
            </v-col>
            <v-col sm="6">
              <v-text-field
                :v-model="form.session"
                label="Duración (en minutos) *"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-select
            :v-model="form.categoria"
            label="Seleccione una categoria"
            :items="items"
            item-title="name"
            item-value="id"
          ></v-select>

          <v-text-field
            :v-model="form.ubication"
            :counter="25"
            label="Ubicación"
          ></v-text-field>

          <v-text-field
            :v-model="form.enlace"
            label="Adjuntar enlace"
          ></v-text-field>

          <v-file-input
            :v-model="form.img"
            :rules="reglas"
            accept="image/png, image/jpeg, image/bmp"
            prepend-icon="mdi-camera"
            label="Sube una o más imagenes"
            multiple
          ></v-file-input>

          <v-btn class="me-2" color="success" @Click.prevent="saveEvent(form)">
            <v-icon start icon="mdi-checkbox-marked-circle"></v-icon>
            Guardar
          </v-btn>

          <v-btn class="ma-2" color="gray" @Click="closeForms">
            <v-icon start icon="mdi-minus-circle"></v-icon>
            Cancelar
          </v-btn>
        </form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "FormComponent",
  props: {
    dialogo: Boolean,
    fechaDisable: Boolean,
    form: { type: Object, default: () => {} },
    items: [],
  },
  data() {
    return {
      alert: false,
      reglas: [
        (value) => {
          return (
            !value ||
            !value.length ||
            value[0].size < 2000000 ||
            "Avatar size should be less than 2 MB!"
          );
        },
      ],
      reglas2: [
        (value) => {
          if (value) return true;
          return "Este campo es obligatorio";
        },
      ],
    };
  },
  methods: {
    closeForms() {
      this.$emit("closeForms");
    },
    saveEvent(form) {
      this.$emit("saveEvent", form);
    },
    onScroll() {
      this.scrollInvoked++;
    },
  },
};
</script>

<style scoped>
.modal-background {
  background-color: rgba(0, 0, 0, 0.5); /* Opacidad del fondo */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 49rem;
  z-index: 9; /* Z-index alto para superponer otros elementos */
}
.micard{
  background-color: white;
}

@media (min-width: 720px) {
  .modal-background {
    background-color: rgba(0, 0, 0, 0.5); /* Opacidad del fondo */
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    z-index: 9; /* Z-index alto para superponer otros elementos */
  }
}
@media (min-width: 1080px) {
  .modal-background {
    background-color: rgba(0, 0, 0, 0.25); /* Opacidad del fondo */
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9; /* Z-index alto para superponer otros elementos */
  }
}
</style>

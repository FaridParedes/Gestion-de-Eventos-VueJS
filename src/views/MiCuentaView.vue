<template>
  <Header></Header>
  <div class="ma-8"><h1>Configuración de mi cuenta</h1></div>
  <div align="center">
    <div class="elevation-6 ancho ma-4" align="center">
      <v-card class="pa-4 w-100">
        <v-avatar  size="100">
          <v-img
          v-if="this.$store.getters.getUsuario.fotoPerfil===null"
            alt="Avatar"
            src="../assets/perfil.png"
          ></v-img>
          <v-img
          v-else
          alt = "Avatar"
          :src="this.$store.getters.getUsuario.fotoPerfil"
          ></v-img>
        </v-avatar>
        <v-card-title>Información</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col> <p>Nombre:</p> </v-col>
            <v-col>
              <p>{{ this.$store.getters.getUsuario.name }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col> <p>Apellido:</p> </v-col>
            <v-col>
              <p>{{ this.$store.getters.getUsuario.lastName }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col> <p>Email:</p> </v-col>
            <v-col>
              <p>{{ this.$store.getters.getUsuario.email }}</p>
            </v-col>
          </v-row>
          <v-row v-if="this.$store.getters.getUsuario.fecNac != null">
            <v-col> <p>Fecha de nacimiento:</p> </v-col>
            <v-col>
              <p>{{ this.$store.getters.getUsuario.fecNac }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col> <p> Rol:</p> </v-col>
            <v-col v-if="this.$store.getters.getUsuario.rol === 'org'">
              <p>Organizador</p>
            </v-col>
            <v-col v-if="this.$store.getters.getUsuario.rol === 'asi'">
              <p>Asistente</p>
            </v-col>
          </v-row>
          <v-btn class="mt-5" color="blue-darken-4" @Click="showModal">
            <v-icon start icon="mdi-pencil"></v-icon>
            Modificar</v-btn>
        </v-card-text>
      </v-card>
    </div>
  </div>
  <v-dialog class="Dialogo" v-model="dialog">
    <v-card
      class="h-75 overflow-y-auto"
      title="Modificar Usuario"
    >
      <v-form ref="form">
        <v-card-text>
          <v-text-field
            :counter="30"
            v-model="usuario.name"
            :rules="rulesName"
            required
            maxLength="30"
            label="Nombre"
          ></v-text-field>

          <v-text-field
            :counter="30"
            v-model="usuario.lastName"
            :rules="rulesLastName"
            maxLength="30"
            required
            label="Apellido"
          ></v-text-field>

          <v-text-field
            type="date"
            v-model="usuario.fecNac"
            label="Fecha de Nacimiento"
            :rules="rulesDate"
            required
          ></v-text-field>

          <v-file-input
            :rules="reglasImg"
            v-on:change="cargarFoto"
            v-model="fotoPerfil"
            accept="image/png, image/jpeg, image/bmp"
            prepend-icon="mdi-camera"
            label="Sube una imagen de perfil"
          ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-btn
            variant="elevated"
            class="me-2"
            color="success"
            @Click.prevent="saveUser(form)"
          >
            <v-icon start icon="mdi-checkbox-marked-circle" ></v-icon>
            Guardar
          </v-btn>
          <v-btn
            variant="elevated"
            class="ma-2"
            color="gray"
            @Click="closeModal"
          >
            <v-icon start icon="mdi-minus-circle"></v-icon>
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
    <v-dialog
    v-model="cargando"
    width="auto"
    class="text-center"
    >
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
                size="128"></v-icon> 
            </v-avatar>
            <p>Datos actualizados correctamente</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue-darken-4" block @click="cerrarCargando">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-if="error" class="text-center">
        <v-card-text>
            <v-avatar size="200"> 
                <v-icon
                class="mb-6"
                color="red"
                icon="mdi-alert-circle-outline"
                size="128"></v-icon> 
            </v-avatar>
            <p>Ups, hubo un error! </p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue-darken-4" block @click="cerrarCargando">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
  <Footer />
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import axios from 'axios';

export default {
  name: "MiCuentaView",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      cargando: false,
      carga: true,
      completada: false,
      error: false,
      dialog: false,
      fotoPerfil: null,
      usuario: {
        id: this.$store.getters.getUsuario.id,
        name: '',
        lastName: '',
        fecNac: '',
        fotoPerfil: '',
      },
      rulesName: [
          v => !!v || 'Título requerido',
          v => (v && v.length <= 30) || 'El título debe tener menos de 30 caracteres',
      ],
      rulesLastName: [
          v => !!v || 'Título requerido',
          v => (v && v.length <= 30) || 'El título debe tener menos de 30 caracteres',
      ],
      reglasImg: [
        (value) => {
          return (
            !value ||
            !value.length ||
            value[0].size < 6000000 ||
            "Avatar size should be less than 6 MB!"
          );
        },
      ],
      rulesDate: [
          v => !!v || 'Fecha requerida',
      ],
    }
  },
  methods: {
    showModal(){
      this.dialog = true;
      this.usuario.name = this.$store.getters.getUsuario.name;
      this.usuario.lastName = this.$store.getters.getUsuario.lastName;
      this.usuario.fecNac = this.$store.getters.getUsuario.fecNac
    },
    closeModal(){
      this.dialog = false;
      this.$refs.form.reset();
    },
    cargarFoto(){
       let reader = new FileReader();
       reader.readAsDataURL(this.fotoPerfil[0])
       reader.onload = () =>{ 
          let dataFoto = reader.result;
          this.usuario.fotoPerfil = dataFoto;
       }
    },
    async saveUser(){
      this.cargando = true;
      if(this.usuario.fotoPerfil === ''){
        this.usuario.fotoPerfil = null;
      }
      await axios.put('http://localhost:8000/api/user/update',this.usuario,{
        headers:{
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
        }
      })
      .then(response => {
        this.carga = false;
        this.completada = true;
        this.$store.dispatch('cargarUsuario', response.data.data);
      }) .catch(error => {
        this.carga = false
        this.error = true
        console.log(error)
      }) 
    },
    cerrarCargando(){
      this.completada = false;
      this.cargando = false;
      if(this.error){
        this.error = false;
      }
      this.closeModal();
    }
  },
  async beforeCreate() {
    let session = JSON.parse(localStorage.getItem("session"))
    if (await session != 'true') {
      this.$router.push("/");
    }
    console.log(this.$store.getters.getMyEventsCalendar)
  },
};
</script>

<style scoped>
/* Estilos personalizados para el calendario */

@media (min-width: 720px) {
  .ancho{
    width: 75%;
  }
  .Dialogo{
    width: 75%
  }
}

@media (min-width: 1080px) {
  .ancho{
    width: 50%;
  }
  .Dialogo{
    width: 50%
  }
}
</style>

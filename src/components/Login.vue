<template>
  <div>
    <div>
        <a
        class="text-h6 text-decoration-none text-blue"
          href="/"
        >
        <v-icon icon="mdi-menu-left"></v-icon>
        Inicio
        </a>    
    </div>
    <v-img
      class="mx-auto my-6"
      max-width="228"
      src=""
    ></v-img>
    <v-card
      class="Dialogo mx-auto pa-12 pb-8"
      elevation="8"
      max-width="800"
      rounded="lg"
    >
    <v-card-title class="text-center">Iniciar sesión</v-card-title>
    <v-alert
        color="error"
        icon="close"
        :closable="sesionFail"
        v-model="sesionFail"
    >
        El correo o la contraseña son incorrectas.
    </v-alert>

            <div class="text-subtitle-1 text-medium-emphasis">Cuenta</div>
            <v-form ref="form">
              <v-text-field
                  v-model="Credenciales.email"
                  density="compact"
                  placeholder="Correo"
                  :rules="[rulesMail, rulesMail2]"
                  required
                  prepend-inner-icon="mdi-email-outline"
                  variant="outlined"
              ></v-text-field>

              <div
                  class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
                  >
                  Contraseña
                  
                  <a
                  class="text-caption text-decoration-none text-blue link-pointer"
                  @click="openCompartirCorreo"
                  rel="noopener noreferrer"
                  >
                  ¿Olvidaste tu contraseña?</a>
              </div>

              <v-text-field
                  v-model="Credenciales.password"
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible ? 'text' : 'password'"
                  density="compact"
                  placeholder="Ingresa tu contraseña"
                  prepend-inner-icon="mdi-lock-outline"
                  :rules="rulesPassword"
                  required
                  variant="outlined"
                  @click:append-inner="visible = !visible"
              ></v-text-field>

              <v-btn block class="mb-4" color="blue" size="large" variant="flat" @click.prevent="login(Credenciales)">
                  Iniciar sesión
              </v-btn>
            </v-form>

            <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
              Iniciar sesión con:
            </div>

            <v-btn
                :disabled="loadingGoogle"
                :loading="loadingGoogle"
                prepend-icon="mdi-google"
                color="blue"
                variant="tonal"
                block
                href="http://localhost:8000/google-auth/redirect"
                @click="loadingGoogle = !loadingGoogle"
                >Google</v-btn>
            
            <v-card-text class="text-center">
                <a
                class="text-blue text-decoration-none"
                href="/registro"
                rel="noopener noreferrer"
                >
                Registrarse ahora <v-icon icon="mdi-chevron-right"></v-icon>
                </a>
            </v-card-text>
    </v-card>

        <!-- Dialog para Enviar Mails -->
        <v-dialog class="Dialogo"  v-model="dialogCorreo">
          <v-card>
            <v-card-title class="pa-6">Recuperación de contraseñas</v-card-title>
            <v-card-text>
              <v-form ref="formCorreo">
                <v-text-field
                  v-model="mailOlvidado"
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
              :disabled="loading"
              :loading="loading"
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
        <v-snackbar v-model="correoValidoSB" timeout="5000" color="red-darken-4">
          Ingrese un correo válido.
        </v-snackbar>
  </div>
</template>

<script>

export default {
  name: "LoginComponent",
  data() {
    return {
      loadingGoogle:false,
      dialogCorreo:false,
      correoValidoSB: false,
      loading: false,
      mailOlvidado: '',
      rulesPassword: [
          v => !!v || 'Contraseña requerida',
        ],
      visible: false,
      rulesMail: value => !!value || 'Correo requerido.',
      rulesMail2: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Ingrese un correo valido.'
      },
      Credenciales: {
        email:'',
        password:'',
      },
      sesionFail: false,

    };
  },
  methods: {
    async login(Credenciales){
      const {valid} = await this.$refs.form.validate();

      if(valid){
        this.$emit("login",Credenciales)
      } else {
        this.sesionFail = true;
      }
    },
    async compartirCorreo(){
      this.loading=true;
      const {valid} = await this.$refs.formCorreo.validate();
      if(valid){
        console.log("No hago nada:c")
        this.loading=false;
      } else{
        this.correoValidoSB = true;
        this.dialogCorreo=false;
        this.$refs.formCorreo.reset();
        this.$refs.formCorreo.resetValidation();
      }
    },
    openCompartirCorreo(){
        this.dialogCorreo = true;
    },
    cancelarCompartirCorreo(){
      this.dialogCorreo=false;
      this.$refs.formCorreo.reset();
      this.$refs.formCorreo.resetValidation();
    },
  },
};
</script>

<style scoped>
.link-pointer {
  cursor: pointer;
}
@media (min-width: 720px) {
  .Dialogo {
    width: 75%;
  }
}
@media (min-width: 1080px) {
  .Dialogo {
    width: 25%;
  }
}
</style>

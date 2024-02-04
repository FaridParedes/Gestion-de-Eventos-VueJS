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
        <v-card-title class="text-center">Restablecer Contraseña</v-card-title>
                <div class="text-subtitle-1 text-medium-emphasis">Nueva Contraseña</div>
                <v-form ref="form">
                <v-text-field
                    v-model="contra"
                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="visible ? 'text' : 'password'"
                    density="compact"
                    placeholder="Nueva Contraseña"
                    :rules="rulesPassword2"
                    required
                    prepend-inner-icon="mdi-lock-outline"
                    variant="outlined"
                    @click:append-inner="visible = !visible"
                ></v-text-field>

                <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                    Confirmar Contraseña
                </div>

                <v-text-field
                    v-model="confirmContra"
                    :append-inner-icon="visible2 ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="visible2 ? 'text' : 'password'"
                    density="compact"
                    placeholder="Confirmar Contraseña"
                    prepend-inner-icon="mdi-lock-outline"
                    :rules="rulesPassword"
                    required
                    variant="outlined"
                    @click:append-inner="visible2 = !visible2"
                ></v-text-field>

                <v-btn :disabled="loading" :loading="loading" block class="mb-4" color="blue" size="large" variant="flat" @click.prevent="resetPassword">
                    Restablecer Contraseña
                </v-btn>
                </v-form>
        </v-card>
        <v-snackbar v-model="camposRequeridos" timeout="5000" color="red-darken-4">
          Todos los campos son requeridos.
        </v-snackbar>
        <v-snackbar v-model="contraDif" timeout="5000" color="red-darken-4">
          Las contraseñas no coinciden 
        </v-snackbar>
    </div>
</template>

<script>
export default {
    name: 'forgotPassword',
    data(){
        return{
            loading:false,
            camposRequeridos: false,
            contraDif: false,
            visible: false,
            visible2: false,
            contra: '',
            confirmContra: '',
            rulesPassword: [
                v => !!v || 'Contraseña requerida',
            ],
            rulesPassword2: [
                v => !!v || 'Contraseña requerida',
            ],
        }
    },
    methods: {
        async resetPassword(){
            this.loading=true
            const {valid} = await this.$refs.form.validate();
            if(valid){
                console.log("paso validacion")
                this.loading=false
            } else {
                console.log("No pasaste validacion")
                this.$refs.form.reset()
                this.$refs.form.resetValidation()
                this.camposRequeridos = true;
                this.loading=false;
            }
        }
    },
}
</script>

<style scoped>
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
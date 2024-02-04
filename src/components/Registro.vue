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
        class="mx-auto pa-12 pb-8"
        elevation="8"
        max-width="458"
        rounded="lg"
        title="Crea una cuenta"
      >
      <v-alert
          color="error"
          value="error"
          :closable="registroFail"
        v-model="registroFail"
      >
          Todos los campos son requeridos
      </v-alert>
        <v-form ref="form">
          <v-row class="mt-4">
              <v-col>
                  <v-text-field
                      v-model="Registro.name"
                      density="compact"
                      :rules="rulesName"
                      required
                      placeholder="Nombre"
                      variant="outlined"
                  ></v-text-field>                
              </v-col>
              <v-col>
                  <v-text-field
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
              v-model="Registro.email"
              density="compact"
              :rules="[rulesEmail, rulesMail2]"
              required
              placeholder="Correo"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
          ></v-text-field>

          <v-text-field
              v-model="Registro.password"
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'"
              density="compact"
              placeholder="Contraseña nueva"
              prepend-inner-icon="mdi-lock-outline"
              variant="outlined"
              @click:append-inner="visible = !visible"
              :rules="rulesPassword"
              required
          ></v-text-field>

          <div class="text-subtitle-1 text-medium-emphasis">Fecha de nacimiento</div>
          <v-text-field
              type="date"
              v-model="Registro.fecNac"
              density="compact"
              placeholder="Apellido"
              variant="outlined"
              :rules="rulesFecha"
              required
          ></v-text-field>
          <div class="text-subtitle-1 text-medium-emphasis">Selecciona tu rol</div>
          <v-select
              v-model="Registro.rol"
              :items="items"
              item-title="rol"
              item-value="abbr"
              label="Select"
              :rules="rulesRol"
              required
          ></v-select>

          <v-btn block class="mb-8" color="blue" size="large" variant="tonal" @click.prevent="sendRegistro(Registro)">
              Registrarte
          </v-btn>
        </v-form>
      </v-card>
    </div>
  </template>
  
  <script>
  export default {
    name: "RegistroComponent",
    data() {
      return {
        rulesName: [
          v => !!v || 'Nombre requerido',
        ],
        rulesLastName: [
          v => !!v || 'Apellido requerido',
        ],
        rulesEmail: value => !!value || 'Correo requerido.',
        rulesPassword: [
          v => !!v || 'Contraseña requerida',
        ],
        rulesFecha: [
          v => !!v || 'Fecha requerida',
        ],
        rulesRol: [
          v => !!v || 'Rol requerido',
        ],
        rulesMail2: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
        },
        visible: false,
        error: false,
        Registro:{
          name: '',
          lastName: '',
          email: '',
          fecNac: '',
          rol: '',
          password: '',
        },
        items:[
            {rol: 'Organizador', abbr: 'org'},
            {rol: 'Asistente', abbr: 'asi'}
        ],
        registroFail: false,
      };
    },
    methods: {
      async sendRegistro(Registro){
          const {valid} = await this.$refs.form.validate();
          if(valid){
            this.$emit('sendRegistro',Registro)
          } else{
            this.registroFail = true;
          }

      }
    },
  };
  </script>
  
  <style scoped></style>
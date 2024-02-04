import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

loadFonts()

// import firebase from "firebase/app";
// import "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

//Cambiar solo esto para conectarse en un futuro
// const firebaseConfig = {
//   apiKey: "AIzaSyAJkIeKbOloQ24bqjXQi8tdWSAIl1ttPZ0",
//   authDomain: "ufds-8d5b3.firebaseapp.com",
//   projectId: "ufds-8d5b3",
//   storageBucket: "ufds-8d5b3.appspot.com",
//   messagingSenderId: "593411610830",
//   appId: "1:593411610830:web:388af5462dba728bbbd89f"
// };
//Hasta acá

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);

// export const db = firebase.firestore();


createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .mount('#app')

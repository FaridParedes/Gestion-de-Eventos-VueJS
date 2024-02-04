import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegistroView from '../views/RegistroView.vue';
import CalendarioView from '../views/CalendarioView.vue';
import MyEventsView from '../views/MyEventsView';
import MiCuentaView from '../views/MiCuentaView.vue';
import InformacionView from '../views/InformacionView.vue';
import ErrorView from '../views/ErrorView.vue';
import GestionarEvento from '../views/GestionarView.vue';
import GoogleLogin from '../views/GoogleLogin.vue';
import MisAsistenciaView from '../views/MisAsistenciaView.vue';
import ForgotPassword from '../views/ForgotPassword.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/registro',
    name: 'registro',
    component: RegistroView
  },
  {
    path:'/myevents',
    name: 'events',
    component: MyEventsView,
  },
  {
    path:'/calendario',
    name: 'Calendario',
    component: CalendarioView,
  },
  {
    path:'/myaccount',
    name: 'Mi cuenta',
    component: MiCuentaView,
  },
  {
    path: '/event/:id',
    name: 'Evento',
    component: InformacionView
  },
  {
    path: '/myevents/:id',
    name: 'Mi Evento',
    component: GestionarEvento
  },
  {
    path: '/google/login/:id/:token',
    name: 'Google Login',
    component: GoogleLogin
  },
  {
    path: '/misasistencias',
    name: 'Mis asistencias',
    component: MisAsistenciaView
  },
  {
    path: '/forgot-password/:email/:token',
    name: 'Forgot Password',
    component: ForgotPassword
  },
  {
    path:'/:ruta(.*)',
    component: ErrorView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


export default router

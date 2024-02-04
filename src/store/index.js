import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist';
import axios from 'axios'

export default createStore({
  state: {
    usuario:[],
    session:false,
    categorias:[],
    ubicaciones:[],
    estados:[],
    events:[],
    myevents:[],
    myeventsCalendar:[],
    asistentesTodos:[],
    asistentes:[],
    comentarios:[],
    eventosFiltrados:[],
    misEventosFiltrados:[],
    misAsistencias:[],
    misAsistenciasCalendar:[],
    favoritos:[]
  },
  getters: {
    getCategorias(state){
        return state.categorias;
    },
    getEstados(state){
      return state.estados;
    },
    getSession(state){
      return state.session;
    },
    getUbicaciones(state){
      return state.ubicaciones;
    },
    getUsuario(state){
      return state.usuario;
    },
    getMyEvents(state){
      return state.myevents;
    },
    getAllEvents(state){
      return state.events;
    },
    getMyEventsCalendar(state){
      return state.myeventsCalendar;
    },
    getComentarios(state){
      return state.comentarios;
    },
    getAsistentes(state){
      return state.asistentes;
    },
    getAsistentesTodos(state){
      return state.asistentesTodos;
    },
    getEventosFiltrados(state){
      return state.eventosFiltrados;
    },
    getMisEventosFiltrados(state){
      return state.misEventosFiltrados;
    },
    getMisAsistencias(state){
      return state.misAsistencias;
    },
    getFavoritos(state){
      return state.favoritos;
    }
  },
  mutations: {
    setCategorias(state, array) {
      state.categorias = array;
    },
    setEstados(state,array){
      state.estados = array;
    },
    setUbicaciones(state,array){
      state.ubicaciones = array;
    },
    setUsuario(state, array){
      state.usuario = array;
      state.session = true;
    },
    setMyEventsCalendar(state,array){
      state.myeventsCalendar = array
    },
    setMyEvents(state,array){
      state.myevents = array;
    },
    setCurrentPageMyEvents(state,data){
      state.myevents.current_page = data;
    },
    setEvents(state, array){
      state.events = array;
    },
    setCurrentPageEvents(state,data){
      state.events.current_page = data;
    },
    setAsistentes(state,data){
      state.asistentes = data;
    },
    setAsistentesTodos(state,data){
      state.asistentesTodos = data;
    },
    setComentarios(state,data){
      state.comentarios = data;
    },
    setEventosFiltrados(state,data){
      state.eventosFiltrados = data;
    },
    setMisEventosFiltrados(state,data){
      state.misEventosFiltrados = data
    },
    setMisAsistencias(state,data){
      state.misAsistencias = data;
    },
    setCurrentPageMisAsistencias(state,data){
      state.misAsistencias.current_page = data;
    },
    setFavoritos(state,data){
      state.favoritos = data;
    },
    setMisAsistenciasCalendar(state,data){
      state.misAsistenciasCalendar = data
    },
    deleteUsuario(state,array){
      state.usuario = array;
      state.session = false;
    },
    deleteAllEvents(state, array){
      state.events = array;
    },
    deleteMyEvents(state,array){
      state.myevents = array;
    }
  },
  actions: {
    async cargarCategorias({commit}){
      try{
        const response = await axios.get('http://localhost:8000/api/categorias');
        commit('setCategorias', response.data);

      } catch(error){
        console.log('Error al cargar categorias',error)
      }
    },
    async cargarEstados({commit}){
      try{
        const response = await axios.get('http://localhost:8000/api/estados');
        commit('setEstados', response.data);
      } catch(error){
        console.log('Error al cargar estados',error)
      }
    },
    async cargarComentarios({commit}, id){
      try{
        axios.get('http://localhost:8000/api/comentarios/'+id)
        .then(response=>{
          commit('setComentarios', response.data.data)
        })
      }catch(error){
        console.log(error)
      }
    },
    async cargarUbicaciones({commit}){
      try {
        const response = await axios.get('http://localhost:8000/api/ubicaciones');
        commit('setUbicaciones', response.data.data);
      } catch (error) {
        console.log(error)
      }
    },
    cargarUsuario({commit}, data){
      commit('setUsuario',data)
    },
    cerrarUsuario({commit},data){
      try{
        commit('deleteUsuario', data)
      } catch (error){
        console.log("no hay datos de usuario")
      }
    },
    cargarMyEventsCalendar({commit}){
      axios.get('http://localhost:8000/api/user/events/all',{
        headers:{
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
        }
      })
      .then(response =>{
        commit('setMyEventsCalendar', response.data.data)
      }).catch(error =>{
        console.log("Hubo error en axios", error)
      })
    },
    cargarMyEvents({commit},pageNumber){
        axios.get('http://localhost:8000/api/user/events?page='+pageNumber,{
        headers:{
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
        }
      })
      .then(response =>{
        commit('setMyEvents', response.data.data)
      }).catch (error =>{
        console.log("Hubo error en axios", error)
      })
    },
    eliminarAllMyEvents({commit},data){
      try{
        commit('deleteMyEvents', data)
      } catch (error){
        console.log("Hubo error en axios", error)
      }
    },
    cargarEventos({commit}, pageNumber){
      axios.get('http://localhost:8000/api/events?page='+pageNumber)
      .then(response =>{
        commit('setEvents', response.data.data)
      }).catch (error =>{
        console.log("Hubo error en axios", error)
      })
    },
    cargarEventosFiltrados({commit}, pageNumber, data){
      axios.post('http://localhost:8000/api/events/filter?page=' + pageNumber, data)
      .then(response =>{
        commit('setEventosFiltrados', response.data.data)
      }).catch(error=>{
        console.log("Error en axios", error)
      })
    },
    eliminarAllEvents({commit},data){
      try{
        commit('deleteAllEvents', data);
      } catch (error){
        console.log("Hubo error en axios", error)
      }
    },
    cargarAsistentes({commit},id){
      try {
        axios.get('http://localhost:8000/api/asistentes/'+id)
        .then(response=>{
          commit('setAsistentes', response.data.data)
        })
      } catch (error) {
        console.log(error)
      }
    },
    cargarAsistentesTodos({commit}){
      try {
        axios.get('http://localhost:8000/api/asistentes')
        .then(response =>{
          commit('setAsistentesTodos',response.data)
        })
      } catch (error) {
        console.log(error);
      }
    },
    cargarMisAsistencias({commit},pageNumber){
      try {
        axios.get('http://localhost:8000/api/user/events/misasistencias?page=' + pageNumber,{
          headers:{
            Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
          }
        }).then(response=>{
          commit('setMisAsistencias', response.data.data)
        }).catch(error=>{
          console.log(error)
        })
      } catch (error) {
        console.log(error);
      }
    },
    cargarFavoritos({commit}){
      axios.get('http://localhost:8000/api/user/favoritos',{
        headers:{
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
        }
      }).then(response=>{
        commit('setFavoritos', response.data.data)
      }).catch(error=>{
        console.log(error)
      })
    },
    enviarNotificaciones(){
      axios.get('http://localhost:8000/api/notificar',{
        headers:{
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
        }
      }).then(response=>{
        console.log(response)
      }).catch(error=>{
        console.log(error)
      })
    },
    cargarMisAsistenciasCalendar({commit}){
      axios.get('http://localhost:8000/api/user/asistencias/all',{
        headers:{
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
        }
      }).then(response=>{
        commit('setMisAsistenciasCalendar', response.data.data)
        console.log(response)
      }).catch(error=>{
        console.log(error)
      })
    }
  },
  modules: {
  },
   plugins:[
     new VuexPersistence({
       storage: window.localStorage
     }).plugin
   ]
})

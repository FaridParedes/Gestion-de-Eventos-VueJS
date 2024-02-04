<template>
  <div class="container">
    <div class="calendar">
      <FullCalendar ref="calendario" :options="opciones">
      </FullCalendar>
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

export default {
  name: 'CalendarioComponent',
  components:{
    FullCalendar,
  },
  data(){
    return{
        showForms: false,
        opciones:{
            timeZone: 'America/Chicago',
            locale: 'es',
            plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
            initialView: 'dayGridMonth',
            headerToolbar:{
              left: '',
              center: 'title',
              right: '',
            },
            footerToolbar:{
              left: 'prev,next today',
              right: 'dayGridMonth,timeGridWeek,listDay'
            },
            buttonText:{
              prev: '<',
              next: '>',
              today: 'Ahora',
              month: 'Mes',
              week: 'Sem',
            },
            allDaySlot: false,
            slotMinTime: "6:00:00",
            slotMaxTime: "22:00:00",
            buttonIcons: false,
            editable: true,
            selectable: true,
            weekends: true,
            dateClick: this.handleDateClick,
            eventClick: this.eventSeleccionado
        }
    }
  },
  methods:{
    eventSeleccionado(arg){
      let eventId = arg.event._def.publicId
      this.$router.push('event/'+ eventId);
    },
    handleDateClick(arg){
      this.$emit('dateClick',arg)
    },
    handleWeekendsToggle() {
      this.opciones.weekends = !this.opciones.weekends // update a property
    },
  },
  created(){
    this.$store.dispatch('cargarCategorias');
    this.$store.dispatch('cargarEstados');
    this.$store.dispatch('cargarMyEventsCalendar');
    this.$store.dispatch('cargarMisAsistenciasCalendar');
  },
  beforeMount() {
    let Eventos = this.ArreglodeEventos.map(Evento => ({
      id: Evento.id,
      title: Evento.title,
      start: Evento.start,
      end: Evento.end
    }));

    let Asistencias = this.ArreglodeAsistencias.map(Asistencia =>({
      id: Asistencia.id,
      title: Asistencia.title,
      start: Asistencia.start,
      end: Asistencia.end,
      backgroundColor: 'red'
    }))

    Eventos.push(...Asistencias)
    this.$data.opciones.events = Eventos;

    console.log()
  },

  watch:{
    ArreglodeEventos(){
        let Eventos = this.ArreglodeEventos.map(Evento => ({
          id: Evento.id,
          title: Evento.title,
          start: Evento.start,
          end: Evento.end
        }));
        let Asistencias = this.ArreglodeAsistencias.map(Asistencia =>({
          id: Asistencia.id,
          title: Asistencia.title,
          start: Asistencia.start,
          end: Asistencia.end,
          backgroundColor: 'red'
        }))
        Eventos.push(...Asistencias)
        this.$data.opciones.events = Eventos;
    },
    // ArreglodeAsistencias(){
    //   let Asistencias = this.ArreglodeAsistencias.map(Asistencia =>({
    //       id: Asistencia.id,
    //       title: Asistencia.title,
    //       start: Asistencia.start,
    //       end: Asistencia.end,
    //       backgroundColor: 'red'
    //     }))
    //     this.$data.opciones.events.push(...Asistencias)
    // }
  },

  computed:{
    ArreglodeEventos:{
      get(){
        return this.$store.state.myeventsCalendar || []
      }
    },
    ArreglodeAsistencias:{
      get(){
        return this.$store.state.misAsistenciasCalendar || []
      }
    }
  }
};
</script>

<style scoped>
/* Estilos personalizados para el calendario */
  .container{
    height: 80%;
  }
  .calendar { 
  border-radius: 0px;
  margin: auto;
  width: 90%;
  }

@media (min-width: 720px) {
  .container{
    margin-top: 1rem;
  }
  .calendar {
    padding: 15px;
    border-radius: 30px;
    margin: auto;
    width: 60%;
  }
}

@media (min-width: 1080px){
  .container{
    margin-top: 1rem;
  }
  .calendar {
    padding: 15px;
    border-radius: 30px;
    margin: auto;
  }
}
</style>

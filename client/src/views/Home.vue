<template>
  <div class="home">
    <h2>Que deseas Hacer {{userLogin.nombreUsuario}}</h2>
    <router-link to="/scan" class="btn">
      Escanear Historias
    </router-link>
    <router-link to="" class="btn">
      ver Historias
    </router-link>
    <router-link to="" class="btn">
      Registrar paciente
    </router-link>
    <router-link to="" class="btn">
      Ver Pacientes Registrados
    </router-link>
    <button @click="logout" class="btn">
      Salir
    </button>
  </div>
</template>

<script>
import {computed} from 'vue'
import {useStore} from "vuex"
export default {
  name: 'Home',
  setup() {
    const store = useStore()
    const userLogin = computed(()=>store.state.userLogin)
    return {
      logout: () => store.dispatch("logout"),
      userLogin
    }
  }
}
</script>

<style lang="scss">
@import '@/css/views/home.scss';
</style>

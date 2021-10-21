<template>
  <header class="header">
    <router-link to="/">
      <h1>Health Reader</h1>
    </router-link>
    <span class="header__name" v-if="userLogin">
      {{userLogin.nombreUsuario}}
    </span>
    <div class="burger" v-if="burgerShow">
      <button @click="()=> burgerSwitch= !burgerSwitch" class="burger__switch">
        <img :src="require('@/assets/icons/burgerIcon.svg')" alt="">
      </button>
      <div @click="()=> burgerSwitch=false" :class="burgerSwitch && 'burger__background--active'" class="burger__background"/>
      <nav class="burger__menu" :class="burgerSwitch && 'burger__menu--active'">
        <router-link to="/scan" class="btn btn--menu">
          Escanear
        </router-link>
        <router-link to="" class="btn btn--menu">
          Registrar Paciente
        </router-link>
        <router-link to="" class="btn btn--menu">
          Ver Pacientes Registrados
        </router-link>
        <router-link v-if="userLogin && userLogin.rol === 'administrador'" to="" class="btn btn--menu">
          Ver Historias
        </router-link>
        <router-link to="" class="btn btn--menu">
          Ver Usuarios
        </router-link>
        <button @click="logout" class="btn btn--menu">
          Salir
        </button>
      </nav>
    </div>
  </header> 
</template>

<script>
import { ref, watch, computed } from 'vue'
import {useRoute} from 'vue-router'
import {useStore} from 'vuex'
export default {
  setup() {
    const store = useStore()
    const burgerSwitch = ref(false)
    const burgerShow = ref(false)
    const Route = useRoute()
    const userLogin = computed(()=>store.state.userLogin)
    watch(Route, ()=> {
      burgerSwitch.value = false
      if(!Route.meta.requireAuth) {
        burgerShow.value = false
      } else {
        burgerShow.value = true
      }
    })
    return {
      logout: () => store.dispatch("logout"),
      burgerSwitch,
      burgerShow,
      userLogin
    }
  },
}
</script>

<style lang="scss">
@import '@/css/components/header.scss';
</style>
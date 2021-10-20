<template>
  <header class="header">
    <h1>Health Reader</h1>
    <div class="burger" v-if="burgerShow">
      <button @click="()=> burgerSwitch= !burgerSwitch" class="burger__switch">
        <img :src="require('@/assets/icons/burgerIcon.svg')" alt="">
      </button>
      <div @click="()=> burgerSwitch=false" :class="burgerSwitch && 'burger__background--active'" class="burger__background"/>
      <nav class="burger__menu" :class="burgerSwitch && 'burger__menu--active'">
        <router-link to="" class="btn btn--menu">
          Escanear
        </router-link>
        <router-link to="" class="btn btn--menu">
          Ver Historias
        </router-link>
        <router-link to="" class="btn btn--menu">
          Ver Usuarios
        </router-link>
        <router-link to="" class="btn btn--menu">
          Salir
        </router-link>
      </nav>
    </div>
  </header> 
</template>

<script>
import { ref, watch } from 'vue'
import {useRoute} from 'vue-router'
export default {
  setup() {
    const burgerSwitch = ref(false)
    const burgerShow = ref(false)
    const Route = useRoute()
    watch(Route, ()=> {
      if(!Route.meta.requireAuth) {
        burgerShow.value = false
      } else {
        burgerShow.value = true
      }
    })
    return {
      burgerSwitch,
      burgerShow
    }
  },
}
</script>

<style lang="scss">
@import '@/css/components/header.scss';
</style>
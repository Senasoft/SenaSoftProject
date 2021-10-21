<template>
  <form @submit.prevent="login(user)" class="login" action="">
    <h3 class="login__title">Login</h3>
    <input v-model="user.email" class="form-input" type="text" placeholder="Correo">
    <input v-model="user.password" class="form-input" type="password" placeholder="Contraseña">
    <span class="text--error" v-if="error">{{error.errors ? error.errors[0].msg : error.msg}}</span>
    <button v-if="!loading" class="btn">Iniciar Sesion</button>
    <Loading v-else/>
  </form> 
</template>
<script>
import Loading from "@/components/Loading.vue"
import {reactive, computed} from 'vue'
import {useStore} from 'vuex'
export default {
  name:"Login",
  components: {
    Loading
  },
  setup() {
    const store = useStore()
    const user = reactive({
      email: "",
      password: ""
    })
    const loading = computed(()=> store.state.loading)
    const error = computed(()=> store.state.error)
    return {
      login: (user) => store.dispatch("login", user),
      user,
      loading,
      error
    }
  }
}
</script>

<style lang="scss">
@import '@/css/views/login.scss';
</style>
<template>
<div class="app">
  <my-header/>
  <main class="main">
    <router-view/>
  </main>
  <my-footer/>
</div>
</template>
<script>
import MyHeader from "@/components/MyHeader.vue"
import MyFooter from "@/components/MyFooter.vue"
import {useStore} from "vuex"
import {onMounted} from "vue"

export default {
  title:"Health Reader",
  components: {
    MyHeader,
    MyFooter
  },
  setup() {
    const store = useStore()
    const getData = ()=> store.dispatch("getDataLocalStorage")
    onMounted(()=> {
      getData()
    })
  },
}
</script>
<style lang="scss">
@import 'css/global.scss';
</style>
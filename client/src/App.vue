<template>
  <div>
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

export default {
  components: {
    MyHeader,
    MyFooter
  },
  setup() {
    
  },
}
</script>
<style lang="scss">
@import 'css/global.scss';
</style>
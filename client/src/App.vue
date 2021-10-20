<template>
  <div>
    <my-header/>
    <router-view/>
  </div>
</template>
<script>
import MyHeader from "@/components/MyHeader.vue"
export default {
  components: {
    MyHeader
  },
  setup() {
    
  },
}
</script>
<style lang="scss">
@import 'css/global.scss';
</style>
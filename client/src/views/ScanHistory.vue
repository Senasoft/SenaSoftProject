<template>
<div class="scanner">
  <video ref="Video" id="video" autoplay class="scanner__video"></video>
  <div v-show="photoModal" class="scanner-modal">
    <canvas class="scanner-modal__canvas" ref="Canvas" id="canvas"></canvas>
    <div class="scanner-modal__buttons">
      <button class="btn btn--scanner-modal" @click="discardImage">Descartar</button>
      <button class="btn btn--scanner-modal" @click="addImage">añadir otra foto</button>
      <button class="btn btn--scanner-modal" @click="uploadImages">Subir Historia</button>

    </div>
  </div>
  <div v-if="loading || error" class="scanner-modal scanner-modal--loading-error">
    <Loading v-if="loading"/>
  </div>
  <div class="scanner__options">
    <button :disabled="photoModal" @click="pickPhoto" class="btn btn--scanner">Scanear</button>
    <button :disabled="photoModal" @click="changeCamera" v-if="dispositives.length > 1" class="scanner__change">
      <img :src="require('@/assets/icons/change.svg')" alt="">
    </button>
  </div>
</div>
</template>

<script>
import {ref, computed, onMounted, watch} from "vue"
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'

import Loading from "@/components/Loading.vue"
export default {
  name:"ScanHistory",
  components: {
    Loading
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const dispositives = ref([])
    const dispositiveSelect = ref()
    const Video = ref(null)
    const Canvas = ref(null)
    const stream = ref(null)
    const photos = ref([])
    const actualPotho = ref(null)
    const photoModal = ref(false)
    const ctx = computed(()=>Canvas.value.getContext('2d'))
    const loading = computed(()=> store.state.loading)
    const error = computed(()=> store.state.error)

    const haveSupport = () => {
      return !!(navigator.getUserMedia || (navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia) || navigator.webkitGetUserMedia || navigator.msGetUserMedia)
    }

    const allowDispositives = () => {
      navigator
        .mediaDevices
        .enumerateDevices()
        .then(function (dispositivos) {
          let listDispositives = [];
          dispositivos.forEach(function (dispositivo) {
            const tipo = dispositivo.kind;
            if (tipo === "videoinput") {
              listDispositives.push(dispositivo);
            }
          });
          dispositives.value = JSON.parse(JSON.stringify(listDispositives))
        });
    }

    onMounted(()=> {
      if (!haveSupport()) {
        router.push('/')
      }
    
      // Comenzamos pidiendo los dispositivos
      allowDispositives();
    })
    watch(dispositives, ()=> {
      if (dispositives.value.length > 0 && !stream.value) {
        dispositiveSelect.value = 0
        // Mostrar stream con el ID del primer dispositivo, luego el usuario puede cambiar
        showStream(dispositives.value[dispositiveSelect.value].deviceId);
      }
    })



    const showStream = idDeDispositivo => {
      navigator.mediaDevices.getUserMedia({
        video: {
          // Justo aquí indicamos cuál dispositivo usar
          deviceId: idDeDispositivo,
        }
      })
      .then(streamObtenido =>{

        // Simple asignación
        stream.value = streamObtenido;

        // Mandamos el stream de la cámara al elemento de vídeo
        Video.value.srcObject = stream.value;
        Video.value.play();

        //Escuchar el click del botón para tomar la foto
      })
      .catch(error => {
        console.error("Permiso denegado o error: ", error);
        router.push('/')
      })
    }

    const changeCamera = () => {
      // Detener el stream
      if (stream.value) {
        stream.value.getTracks().forEach( track => {
          track.stop();
        });
      }
      dispositiveSelect.value = dispositiveSelect.value === 0 ? 1 : 0 
      // Mostrar el nuevo stream con el dispositivo seleccionado
      showStream(dispositives.value[dispositiveSelect.value].deviceId);
    }
    const pickPhoto = () => {
    
      //Pausar reproducción
      Video.value.pause();

      //Obtener contexto del canvas y dibujar sobre él
      Canvas.value.width = Video.value.videoWidth;
      Canvas.value.height = Video.value.videoHeight;
      ctx.value.drawImage(Video.value, 0, 0, Canvas.value.width, Canvas.value.height);

      Canvas.value.toBlob((blob)=> {
        actualPotho.value = blob
        photoModal.value = true
      },'image/jpeg')
    }

    const addImage = () => {
      photos.value.push(actualPotho.value)
      actualPotho.value = null
      photoModal.value = false
      //Reanudar reproducción
      Video.value.play();
    }
    const discardImage = () => {
      actualPotho.value = null
      photoModal.value = false
      //Reanudar reproducción
      Video.value.play();
    }
    const uploadImages = () => {
      photos.value.push(actualPotho.value)
      store.dispatch('uploadPhoto', photos.value)
      actualPotho.value = null
      photoModal.value = false
      //Reanudar reproducción
      Video.value.play();
    }

    return {
      Video,
      Canvas,
      ctx,
      pickPhoto,
      changeCamera,
      dispositiveSelect,
      dispositives,
      photoModal,
      addImage,
      discardImage,
      uploadImages,
      loading,
      error
    }
  },
}
</script>

<style lang="scss">
@import '@/css/views/ScanHistory.scss';

</style>
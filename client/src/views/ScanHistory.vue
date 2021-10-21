<template>
<div class="scanner">
  <video ref="Video" id="video" autoplay class="scanner__video"></video>
  <canvas ref="Canvas" width="100%" height="100%" id="canvas"></canvas>
  <div class="scanner__options">
    <button @click="pickPhoto" class="btn btn--scanner">Scanear</button>
    <button @click="changeCamera" v-if="dispositives.length > 1" class="scanner__change">
      <img :src="require('@/assets/icons/change.svg')" alt="">
    </button>
  </div>
</div>
</template>

<script>
import {ref, computed, onMounted, watch} from "vue"
import {useRouter} from 'vue-router'
export default {
  name:"ScanHistory",
  setup() {
    const router = useRouter()
    const dispositives = ref([])
    const dispositiveSelect = ref()
    const Video = ref(null)
    const Canvas = ref(null)
    const stream = ref(null)
    const ctx = computed(()=>Canvas.value.getContext('2d'))
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
      if (dispositives.value.length > 0) {
        dispositiveSelect.value = 0
        // Mostrar stream con el ID del primer dispositivo, luego el usuario puede cambiar
        mostrarStream(dispositives.value[dispositiveSelect.value].deviceId);
      }
    })



    const mostrarStream = idDeDispositivo => {
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
          console.log("Permiso denegado o error: ", error);
          router.push('/')
        })
    }

    const changeCamera = () => {
      // Detener el stream
      if (stream.value) {
        stream.value.getTracks().forEach(function (track) {
          track.stop();
        });
      }
      dispositiveSelect.value = dispositiveSelect.value === 0 ? 1 : 0 
      // Mostrar el nuevo stream con el dispositivo seleccionado
      mostrarStream(dispositives.value[dispositiveSelect].deviceId);
    }
    const pickPhoto = () => {
    
      //Pausar reproducción
      Video.value.pause();

      //Obtener contexto del canvas y dibujar sobre él
      Canvas.value.width = Video.value.videoWidth;
      Canvas.value.height = Video.value.videoHeight;
      ctx.value.drawImage(Video.value, 0, 0, Canvas.value.width, Canvas.value.height);

      let foto = Canvas.value.toDataURL(); //Esta es la foto, en base 64
      console.log(foto)

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
      dispositives
    }
  },
}
</script>

<style lang="scss">
@import '@/css/views/ScanHistory.scss';
</style>
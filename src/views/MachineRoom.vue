<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {convertCanvasAxes2GlAxes, Stage} from "@/utils/ThreeUtils";
import {Mesh, MeshBasicMaterial, Raycaster} from "three";
import {getCabinetByName} from "@/server/Cabinet";
// canvas操作对象
const canvasRef = ref<HTMLCanvasElement>()
let stage: Stage
onMounted(() => {
  // 初始化机房场景
  if (canvasRef.value) {
    // 1.构建场景
    stage = new Stage(canvasRef.value)
    // 2.加载模型
    stage.loadGLTF("machineRoom.gltf");
    // 3.渲染
    stage.render()
    // 4.监听窗口变化
    window.addEventListener('resize', windowResize)
    // 5.监听自身的派发事件
    stage.addEventListener('selected', handleSelected)
    stage.addEventListener('move', handleMove)
    stage.addEventListener('leave', handleLeave)
  } else {
    alert('初始化场景失败')
  }
})

const currentCab = ref<Mesh>()

// 窗口重置函数
function windowResize() {
  const {clientWidth, clientHeight} = canvasRef.value
  stage.renderer.setSize(clientWidth * devicePixelRatio, clientHeight * devicePixelRatio, false)
  stage.camera.aspect = clientWidth / clientHeight
  stage.camera.updateProjectionMatrix()
}

function mousemoveHandler(e: MouseEvent) {
  const offsetX = e.offsetX
  const offsetY = e.offsetY
  const glOffset = convertCanvasAxes2GlAxes(offsetX, offsetY, canvasRef.value)
  const raycaster = new Raycaster()
  raycaster.setFromCamera(glOffset, stage.camera)
  const intercects = raycaster.intersectObjects(stage.cabinets)
  if (intercects.length) {
    const insectObj = intercects[0].object as Mesh
    if (currentCab.value && insectObj.name !== currentCab.value.name) {
      currentCab.value.material.setValues({
        map: stage.maps.get('cabinet.jpg')
      })

    } else {
      insectObj.material.setValues({
        map: stage.maps.get('cabinet-hover.jpg')
      })
    }
    stage.dispatchEvent({type: 'move', offset: {offsetX, offsetY}})
    if(!currentCab.value || insectObj.name !== currentCab.value.name) {
      stage.dispatchEvent({type: 'selected', name: insectObj})
    }
    currentCab.value = insectObj
  } else {
    if (currentCab.value) {
      currentCab.value.material.setValues({
        map: stage.maps.get('cabinet.jpg')
      })
    }
    stage.dispatchEvent({type: 'leave'})
  }
}

// 获取机柜信息
const cabinetInfo = ref<{
  temperature: number, capacity: number, count: number, name: string
}>({
  temperature: 0, capacity: 0, count: 0, name: ''
})

const left = ref(0)
const top = ref(0)
const display = ref('none')
const panelStyle = computed(() => {
  return {
    left: left.value + 'px',
    top: top.value + 'px',
    display: display.value
  }
})

function handleSelected(tar) {
  getCabinetByName(tar.name.name).then(({temperature, capacity, count}) => {
    cabinetInfo.value = {name: tar.name.name, temperature, capacity, count}
  });
}

function handleMove(offset) {
  const {offsetX: x, offsetY: y} = offset.offset
  top.value = y
  left.value = x
  display.value = 'block'
}

function handleLeave() {
  display.value = 'none'
}
</script>

<template>
  <div class="wrapper">
    <canvas class="canvas"
            ref="canvasRef"
            @mousemove="mousemoveHandler"></canvas>
    <div id="plane" :style="panelStyle">
      <p>机柜名称：{{ cabinetInfo.name }}</p>
      <p>机柜温度：{{ cabinetInfo.temperature }}°</p>
      <p>
        使用情况：{{ cabinetInfo.count }}/{{ cabinetInfo.capacity }}
      </p>
    </div>
  </div>

</template>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  height: 100%;
  position: relative;

  #plane {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    padding: 0 18px;
    transform: translate(12px, -100%);
  }
}

.canvas {
  width: 100%;
  height: 100%;
}
</style>
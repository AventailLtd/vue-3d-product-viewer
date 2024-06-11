<template>
  <h1>
    3D Product viewer dev
  </h1>
  <product-viewer
    class="product-viewer-wrapper"
    :images="images"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ProductViewer } from '../src/index'

export default defineComponent({
  name: 'App',
  components: {
    ProductViewer,
  },
  setup() {
    const imageCount = 100 // 100 image
    const images = Array.from({ length: imageCount }, (_, i) => {
      const index = String(i + 1).padStart(3, '0')
      return new URL(`./images/${index}.jpg`, import.meta.url).href
    })

    return {
      images,
    }
  },
})
</script>

<style>
.product-viewer-wrapper {
  width: 50rem;
  height: 30rem;
  background-color: #0a3622;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

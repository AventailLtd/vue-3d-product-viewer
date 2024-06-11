<template>
  <div
    v-if="images.length > 0"
    ref="productViewer"
    @mouseup="stopDrag"
    @mousedown="startDrag"
    @mouseleave="stopDrag"
  >
    <div class="pointer-events-none">
      <img :src="currentImage" alt="">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  name: 'ProductViewer',
  props: {
    /**
     * Images
     */
    images: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  data() {
    return {
      /**
       * Currently rendered picture index
       */
      currentImageIndex: 0 as number,
      /**
       * Current X position of mouse
       */
      currentX: 0 as number,
      /**
       * Start dragging position of mouse
       */
      startX: 0 as number,
      /**
       * Sensitivity of dragging
       */
      sensitivity: 2 as number,
    }
  },
  computed: {
    /**
     * Current image path
     */
    currentImage(): string {
      return this.images[this.currentImageIndex]
    },
  },
  methods: {
    startDrag(event: MouseEvent) {
      this.startX = event.clientX
      const viewer = this.$refs.productViewer as HTMLElement
      viewer.addEventListener('mousemove', this.onDrag)
      this.currentX = event.clientX
    },
    stopDrag() {
      const viewer = this.$refs.productViewer as HTMLElement

      viewer.removeEventListener('mousemove', this.onDrag)
    },
    onDrag(event: MouseEvent) {
      const deltaX = event.clientX - this.currentX

      if (Math.abs(deltaX) > this.sensitivity) {
        const direction = deltaX > 0 ? -1 : 1
        this.currentImageIndex = (this.currentImageIndex + direction + this.images.length) % this.images.length
        this.currentX = event.clientX
      }
    },
  },
})
</script>

<style lang="css" scoped>
.pointer-events-none {
  pointer-events: none;
  user-select: none;

  img {
    max-width: 100%;
  }
}
</style>

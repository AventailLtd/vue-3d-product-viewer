<template>
  <div
    v-if="images.length > 0"
    ref="productViewer"
    @mouseup="stopDrag"
    @mousedown="startDrag"
    @mouseleave="stopDrag($event, true)"
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
    /**
     * Drag sensitivity
     */
    sensitivity: {
      type: Number,
      default: 3,
    },
    /**
     * Rolling speed
     */
    speed: {
      type: Number,
      default: 20,
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
       * RollingInterval
       */
      rollingInterval: null as ReturnType<typeof setInterval> | null,
      /**
       * RollingInterval
       */
      startRollingInterval: null as ReturnType<typeof setInterval> | null,
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
      if (this.rollingInterval !== null) {
        clearInterval(this.rollingInterval)
      }
    },
    stopDrag(_: MouseEvent, isLeave: boolean = false) {
      const viewer = this.$refs.productViewer as HTMLElement
      viewer.removeEventListener('mousemove', this.onDrag)

      if (isLeave) {
        return true
      }

      const intervalDuration = Math.abs(this.startX - this.currentX) * 1.5

      const deltaX = this.startX - this.currentX
      const direction = deltaX > 0 ? 1 : -1

      this.rollingInterval = setInterval(() => {
        this.currentImageIndex = (this.currentImageIndex + direction + this.images.length) % this.images.length
      }, this.speed)

      setTimeout(() => {
        if (this.rollingInterval !== null) {
          clearInterval(this.rollingInterval)
        }
      }, intervalDuration)
    },
    onDrag(event: MouseEvent) {
      if (this.startRollingInterval !== null) {
        clearInterval(this.startRollingInterval)
      }
      const deltaX = event.clientX - this.currentX

      if (Math.abs(deltaX) > this.sensitivity) {
        const direction = deltaX > 0 ? -1 : 1
        this.currentImageIndex = (this.currentImageIndex + direction + this.images.length) % this.images.length
        this.currentX = event.clientX
      }

      this.startRollingInterval = setInterval(() => {
        this.startX = event.clientX
        if (this.startRollingInterval !== null) {
          clearInterval(this.startRollingInterval)
        }
      }, 20)
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

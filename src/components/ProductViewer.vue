<template>
  <div
    v-if="images.length > 0"
    ref="productViewer"
    @mouseup="stopDrag"
    @mousedown="startDrag"
    @mouseleave="stopDrag($event, true)"
    @touchstart="startDrag"
    @touchend="stopDrag"
  >
    <div class="pointer-events-none">
      <img
        v-for="(image, index) in images"
        :key="index"
        :class="{'hide-product-viewer-image': currentImageIndex !== index}"
        :src="image"
        alt=""
      >
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
    /**
     * Autostart
     */
    autoStart: {
      type: Boolean,
      default: false,
    },
    /**
     * Auto rolling speed
     */
    autoRollingSpeed: {
      type: Number,
      default: 75,
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
       * Is swipe rolling done
       */
      rollingDone: false as boolean,
      /**
       * RollingInterval
       */
      startRollingInterval: null as ReturnType<typeof setInterval> | null,
      /**
       * RollingInterval
       */
      autoStartInterval: null as ReturnType<typeof setInterval> | null,
      /**
       * Product view intersection observer
       */
      observer: null as IntersectionObserver | null,
      /**
       * Is intersected already
       */
      isIntersected: false,
    }
  },
  mounted() {
    this.createObserver()
  },
  beforeUnmount() {
    this.observer?.disconnect()
  },
  methods: {
    /**
     * Starts the view automatically
     */
    startAutoPlay() {
      if (!this.autoStart) {
        return
      }

      this.autoStartInterval = setInterval(() => {
        this.currentImageIndex = (this.currentImageIndex + 1 + this.images.length) % this.images.length
      }, this.autoRollingSpeed)
    },
    /**
     * Starts dragging
     *
     * @param event
     */
    startDrag(event: MouseEvent | TouchEvent) {
      this.clearIntervals()
      this.rollingDone = true
      this.startX = 'clientX' in event ? event.clientX : event.touches[0].clientX
      const viewer = this.$refs.productViewer as HTMLElement
      viewer.addEventListener('mousemove', this.onDrag)
      viewer.addEventListener('touchmove', this.onDrag)
    },
    /**
     * Stops dragging
     * @param _
     * @param isLeave
     */
    stopDrag(_: MouseEvent | TouchEvent, isLeave: boolean = false) {
      const viewer = this.$refs.productViewer as HTMLElement
      viewer.removeEventListener('mousemove', this.onDrag)
      viewer.removeEventListener('touchmove', this.onDrag)

      if (isLeave) {
        return true
      }

      this.rollingDone = false
      const intervalDuration = Math.abs(this.startX - this.currentX) * 3

      const deltaX = this.startX - this.currentX
      const direction = deltaX > 0 ? 1 : -1

      this.slowRolling(this.speed, direction)

      setTimeout(() => {
        this.rollingDone = true
      }, intervalDuration)
    },
    /**
     * Slows rolling if swiped
     * @param speed
     * @param direction
     */
    slowRolling(speed: number, direction: number) {
      if (this.rollingDone) {
        return
      }

      setTimeout(() => {
        this.currentImageIndex = (this.currentImageIndex + direction + this.images.length) % this.images.length
        this.slowRolling(speed + 1, direction)
      }, speed)
    },
    /**
     * Action while dragging
     *
     * @param event
     */
    onDrag(event: MouseEvent | TouchEvent) {
      if (this.startRollingInterval !== null) {
        clearInterval(this.startRollingInterval)
      }
      const clientX = 'clientX' in event ? event.clientX : event.touches[0].clientX
      const deltaX = clientX - this.currentX

      if (Math.abs(deltaX) > this.sensitivity) {
        const direction = deltaX > 0 ? -1 : 1
        this.currentImageIndex = (this.currentImageIndex + direction + this.images.length) % this.images.length
        this.currentX = clientX
      }

      this.startRollingInterval = setInterval(() => {
        this.startX = clientX
        if (this.startRollingInterval !== null) {
          clearInterval(this.startRollingInterval)
        }
      }, 20)
    },
    /**
     * Clears intervals
     */
    clearIntervals() {
      if (this.autoStartInterval !== null) {
        clearInterval(this.autoStartInterval)
      }
      if (this.startRollingInterval !== null) {
        clearInterval(this.startRollingInterval)
      }
    },
    /**
     * Creates an observer which is checking is the div rendered
     */
    createObserver() {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      }

      this.observer = new IntersectionObserver(this.handleIntersect, options)
      const viewer = this.$refs.productViewer as HTMLElement
      this.observer.observe(viewer)
    },
    /**
     * Handling intersect
     * @param entries
     */
    handleIntersect(entries: IntersectionObserverEntry[]) {
      entries.forEach(entry => {
        if (!this.isIntersected && entry.isIntersecting) {
          this.startAutoPlay()
          this.isIntersected = true
        }
      })
    },
  },
})
</script>

<style lang="css" scoped>
.pointer-events-none {
  position: relative;
  pointer-events: none;
  user-select: none;
  width: 100%;
  height: 100%;

  img {
    max-width: 100%;
    position: absolute;
    top: 0;
  }

  .hide-product-viewer-image {
    opacity: 0;
  }
}
</style>

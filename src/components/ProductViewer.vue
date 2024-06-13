<template>
  <div
    v-if="images.length > 0"
    ref="productViewer"
    @mouseup="stopDrag"
    @mousedown="startDrag"
    @mouseleave="stopDrag"
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
     * Seconds, under mousemove is recognized as swipe
     */
    swipeSensitivity: {
      type: Number,
      default: 0.30,
    },
  },
  data() {
    return {
      /**
       * Auto rolling speed degree/sec
       * NOTE: starting value is from prop, later this value will change, that's why it's stored in data
       */
      speedData: this.speed,
      /**
       * Start dragging position of mouse
       */
      startX: 0 as number,
      /**
       * Start degree of rotation
       */
      startAngle: 0 as number,
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
      isIntersected: false as boolean,
      /**
       * Actual view degree (0-360)
       */
      angle: 0 as number,
      /**
       * Mouse button clicked
       */
      mouseDownTimer: 0 as number,
      /**
       * When mouse button released
       */
      mouseUpTimer: 0 as number,
    }
  },
  computed: {
    currentImageIndex(): number {
      // angle increment is calculated of 360 degrees which is divided with the number of used pictures
      const angleIncrement = 360 / this.images.length
      const index = Math.floor(this.angle / angleIncrement)
      // index can be negative, then we need this.images.length + index. Ex: 100 + (-1)
      return index >= 0 ? index : this.images.length + index
    },
    rotateDensity() {
      // TODO: video density degree
      return 20
    },
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
    startAutoRolling(autoSlow: boolean = true): void {
      this.autoStartInterval = setInterval(() => {
        if (autoSlow) {
          this.speedData *= 0.98
          if (Math.abs(this.speedData) < this.rotateDensity) {
            this.clearIntervals()
            return
          }
        }
        this.angle = (this.angle + this.speedData / 100) % 360
      }, 10)
    },
    /**
     * Starts dragging
     */
    startDrag(event: MouseEvent | TouchEvent): void {
      this.startAngle = this.angle
      this.clearIntervals()
      this.startX = 'clientX' in event ? event.clientX : event.touches[0].clientX
      const viewer = this.$refs.productViewer as HTMLElement
      viewer.addEventListener('mousemove', this.onDrag)
      viewer.addEventListener('touchmove', this.onDrag)
      this.mouseDownTimer = performance.now()
    },
    /**
     * Stops dragging
     */
    stopDrag(event: MouseEvent | TouchEvent): void {
      const viewer = this.$refs.productViewer as HTMLElement
      viewer.removeEventListener('mousemove', this.onDrag)
      viewer.removeEventListener('touchmove', this.onDrag)
      this.mouseUpTimer = performance.now()

      const elapsedSec = (this.mouseUpTimer - this.mouseDownTimer) / 1000

      if (elapsedSec > this.swipeSensitivity) {
        // not swiped after a time
        return
      }

      const clientX = 'clientX' in event ? event.clientX : event.touches[0].clientX

      this.speedData = (clientX - this.startX) / elapsedSec * -1 / 5
      this.startAutoRolling()
    },
    /**
     * Action while dragging
     */
    onDrag(event: MouseEvent | TouchEvent): void {
      const clientX = 'clientX' in event ? event.clientX : event.touches[0].clientX
      const deltaX = (clientX - this.startX) / 10 // pixel to angle

      this.angle = (this.startAngle - deltaX) % 360
    },
    /**
     * Clears intervals
     */
    clearIntervals() {
      if (this.autoStartInterval !== null) {
        clearInterval(this.autoStartInterval)
      }
    },
    /**
     * Creates an observer which is checking is the div rendered
     */
    createObserver(): void {
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
     */
    handleIntersect(entries: IntersectionObserverEntry[]): void {
      entries.forEach(entry => {
        if (!this.isIntersected && entry.isIntersecting) {
          if (this.autoStart) {
            this.startAutoRolling(false)
          }

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

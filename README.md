# Vue 3D Product viewer

### Introduction:
The ProductViewer creates a rotatable product animation from a collection of images. The rotation is possible on the X-axis, both manually and automatically. There is no fixed number of images it can work with.

## Installation:

### Vue2
 - yarn add vue2-3d-product-viewer
 - nmp install vue2-3d-product-viewer

### Vue3
- yarn add vue-3d-product-viewer
- nmp install vue-3d-product-viewer


### Import:

```
  import { ProductViewer } from 'vue2-3d-product-viewer'
  import 'vue2-3d-product-viewer/dist/style.css'
```

### Example:
```
  <product-viewer
    :images="pictures"
    :speed="20"
    :auto-start="true"
    :swipe-sensitivity="0.30"
  />
```

### Props:

| Props             | Type    | Default                          | Description                                                                                           |
|-------------------|---------|----------------------------------|-------------------------------------------------------------------------------------------------------|
| images            | Array   | required (has not default vaule) | Array of images                                                                                       |
| speed             | Number  | 20                               | Rolling speed (degree/sec)                                                                            |
| autoStart         | Boolean | false                            | Starts auto rotating. When the ProductViewer appears on the screen, it automatically starts rotating. |
| swipeSensitivity  | Number  | 0.3                              | Seconds, under mousemove is recognized as swipe                                                       |
| rotationAreaFixed | Boolean | true                             | Rotate is working only if mouse dragged into product viewer area                                      |
| sliderVisible     | Boolean | true                             | Slider row is another way to rotate the picture. If it's false, the slider won't be visible           |

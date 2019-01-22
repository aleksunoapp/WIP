<template>
  <div class="image">
    <img :src="imageSrc" :alt="alt">
  </div>
</template>
<script>
import loadingImage from '@/assets/images/loadingImage.js'

export default {
  name: 'ImageContainer',
  props: {
    src: {
      required: true,
      type: String
    },
    alt: {
      required: false,
      type: String,
      default: () => 'Placeholder image'
    },
    placeholder: {
      required: false,
      default: () => loadingImage,
      type: String
    }
  },
  data: function () {
    return {
      imageSrc: this.placeholder
    }
  },
  mounted: function () {
    const img = new Image()
    const _this = this
    img.onload = function () {
      _this.imageSrc = _this.src
    }
    img.src = this.src
  }
}
</script>
<style scoped>
.image {
  width: 100%;
  height: 100%;
  position: relative;
}
.image img {
  /* contain x and y axes */
  max-width: 100%;
  max-height: 100%;
  /* center */
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
</style>

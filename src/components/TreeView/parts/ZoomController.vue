<template>
  <div class="content-header-actions d-flex align-center">
    <!--RestoreScale-->
    <div
      v-ripple
      class="content-header-actions-button d-flex justify-center align-center"
      @click="restoreScale"
    >
      <v-icon
        :color="colors['neutral2']"
        x-small
        v-text="'mdi-image-filter-center-focus'"
      />
    </div>

    <!--ZoomOut-->
    <div
      v-ripple
      class="content-header-actions-button d-flex align-center"
      data-test-zoon-out
      @click="zoomOut"
    >
      <v-icon :color="colors['neutral2']" x-small v-text="'fi-rr-zoom-out'" />
    </div>

    <!--ZoomPercent-->
    <input
      class="content-header-actions-input d-flex align-center"
      data-test-zoon-percent
      :value="zoomScale"
      @input="changeZoomScale"
    />

    <!--ZoomIn-->
    <div
      v-ripple
      class="content-header-actions-button d-flex align-center"
      data-test-zoon-in
      @click="zoomIn"
    >
      <v-icon :color="colors['neutral2']" x-small v-text="'fi-rr-zoom-in'" />
    </div>

    <!--Help-->
    <div
      v-ripple
      class="content-header-actions-button d-flex align-center"
      @click="help"
    >
      <v-icon
        :color="colors['neutral2']"
        x-small
        v-text="'fi-rr-interrogation'"
      />
    </div>
  </div>
</template>
<script>
import _colors from '@/styles/abstracts/temp.js'
export default {
  name: 'zoom-controller',
  props: {
    zoomScale: {
      type: String,
    },
    help: {
      type: Function,
    },
  },
  data() {
    return {
      colors: _colors,
    }
  },
  inject: ['changeZoomScale', 'restoreScale', 'zoomOut', 'zoomIn'],
}
</script>

<style lang="scss" scoped src="../style.scss" />
@/styles/abstracts/temp.js

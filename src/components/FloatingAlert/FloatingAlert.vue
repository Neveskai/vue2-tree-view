<template>
  <div id="floating-alert" v-if="visible">
    <div class="floating-alert" :class="`floating-alert-${alert.type}`">
      <span class="floating-alert-text">{{ alert.messagePrefix }}</span>
      <i
        @click="visible = false"
        class="mr-2 floating-alert-close fi fi-rr-cross-circle"
      ></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FloatingAlert',
  props: {
    duration: {
      type: Number,
      default: 5000,
    },
  },
  data() {
    return {
      alert: {
        type: '',
        description: '',
        messagePrefix: '',
      },
      visible: false,
    }
  },
  methods: {
    displayAlert(config) {
      this.alert = config
      this.visible = true

      setTimeout(() => {
        this.visible = false
      }, this.duration)
    },
  },
}
</script>

<style src="./style.scss" lang="scss" scoped></style>

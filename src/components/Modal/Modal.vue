<template>
  <section class="modal-container" v-if="visible">
    <div class="modal-overlay"></div>

    <div class="modal-body">
      <slot></slot>
    </div>
  </section>
</template>
<script>
export default {
  name: 'ModalVue',
  data() {
    return {
      visible: false,
    }
  },
  methods: {
    open() {
      this.visible = true
    },
    close() {
      this.visible = false
    },
  },
}
</script>

<style src="./style.scss" lang="scss" scoped />

<template>
  <div class="d-flex" @click="handleClick">
    <img class="text-image" :src="image" />

    <v-tooltip
      top
      allowOverflow
      open-on-hover
      z-index="999"
      max-width="300px"
      :disabled="!isEllipsisActive"
    >
      <template v-slot:activator="{ on }">
        <span
          class="text-image-label"
          ref="label"
          v-on="on"
          data-test-text-icon-label
        >
          {{ label }}
        </span>
      </template>
      <div class="item-label-tooltip">
        <slot name="innerTooltip">
          {{ label }}
        </slot>
      </div>
    </v-tooltip>
  </div>
</template>
<script>
export default {
  name: 'TextIcon',
  data() {
    return {
      isEllipsisActive: false,
    }
  },
  methods: {
    handleClick() {
      if (this.onClick) this.onClick()
    },
  },
  props: {
    label: String,
    image: String,
    overflow: Number,
    onClick: Function,
  },
  mounted() {
    const span = this.$refs.label
    this.isEllipsisActive = span.innerHTML.length >= this.overflow
  },
}
</script>
<style src="./style.scss" lang="scss" scoped />

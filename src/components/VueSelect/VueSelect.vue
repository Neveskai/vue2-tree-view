<template>
  <div data-app class="select-vue">
    <v-autocomplete
      @change="onChange"
      :items="options"
      :label="label"
      :value="value"
      :item-text="optLabel"
      :item-value="optValue"
      dense
      outlined
      clearable
      return-object
    ></v-autocomplete>
  </div>
</template>
<script>
export default {
  name: 'VueSelect',
  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: Object,
      default: () => {},
    },
    onChange: {
      type: Function,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    optLabel: {
      type: String,
      default: 'label',
    },
    optValue: {
      type: String,
      default: 'value',
    },
  },
}
</script>
<style src="./style.scss" lang="scss" scoped />

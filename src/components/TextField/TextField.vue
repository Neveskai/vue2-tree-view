<template>
  <v-textarea
    :label="label"
    rows="2"
    class="text-area"
    :color="colors['neutral2']"
    :rules="_rules"
    :counter="maxLength"
    :background-color="colors['neutral']"
    filled
    no-resize
    hide-spin-buttons
    :value="value"
    @change="onChange"
  />
</template>
<script>
import colors from '@/styles/abstracts/temp.js'

export default {
  name: 'TextField',
  props: {
    value: {
      type: String,
      required: true,
    },
    onChange: {
      type: Function,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    maxLength: {
      type: Number,
      default: 200,
    },
  },
  data() {
    return {
      rules: {
        required: v => !!v || this.$t('required'),
        length: v => v?.length <= this.maxLength || this.$t('length'),
      },
      colors: colors,
    }
  },
  computed: {
    _rules() {
      return this.required
        ? [this.rules.required, this.rules.length]
        : undefined
    },
  },
}
</script>

<style src="./style.scss" lang="scss" scoped />

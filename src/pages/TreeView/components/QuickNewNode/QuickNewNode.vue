<template>
  <div class="tree-node">
    <v-textarea
      @keydown.enter="handleSave"
      v-model="text"
      ref="form"
      rows="3"
      class="text-area"
      error-count="1"
      :color="colors['neutral2']"
      :rules="[rules.required, rules.length(length)]"
      :counter="length"
      :background-color="colors['neutral']"
      filled
      no-resize
      hide-spin-buttons
    />

    <div class="actions">
      <v-btn :disabled="loading" @click="node.cancel" icon x-small>
        <v-icon x-small v-text="'fi-br-cross'" />
      </v-btn>

      <v-btn
        @click="handleSave"
        :disabled="_disableSave"
        :loading="loading"
        icon
        x-small
      >
        <v-icon x-small v-text="'fi-br-check'" />
      </v-btn>
    </div>
  </div>
</template>
<script>
import colors from '@/styles/abstracts/temp.js'
import catSvg from '@/__mocks__/cat.svg'

export default {
  name: 'TreeNode',
  props: {
    node: {
      type: Object,
    },
    length: {
      type: Number,
      default: 200,
    },
  },
  computed: {
    _disableSave() {
      return !this.text || !this.text.length || this.loading
    },
  },
  data() {
    return {
      loading: false,
      colors: colors,
      text: '',
      rules: {
        required: v => !!v || this.$t('required'),
        length: len => v => v?.length <= len || this.$t('length', this.length),
      },
    }
  },
  methods: {
    handleSave() {
      const node = {
        name: this.text,
        image: catSvg,
        inactive: false,
        childrenCount: 0,
        children: [],
      }

      this.node.success(node)
    },
  },
}
</script>

<style lang="scss" scoped src="./style.scss" />

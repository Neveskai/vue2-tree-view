<template>
  <div data-app>
    <v-select :items="items" label="Standard" outlined></v-select>
  </div>
</template>
<script>
const DEFAULT_NODE = { name: '', image: null }

export default {
  name: 'VueSelect',
  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: Object,
      required: true,
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
  },
  computed: {
    modal() {
      return this.$refs.modal
    },
  },
  methods: {
    itemProps(item) {
      return {
        title: item.label,
        subtitle: item.value,
      }
    },
    handleSave() {
      const node = {
        name: this.node.name,
        image: this.node.image,
      }

      this.node.success(node)
      this.modal.close()
    },
    open(refNode) {
      this.node = refNode
      this.modal.open()

      return this.node
    },
    close() {
      this.node = DEFAULT_NODE
      this.modal.close()
    },
  },
  data: () => ({
    items: ['Foo', 'Bar', 'Fizz', 'Buzz'],
  }),
}
</script>

<style src="./style.scss" lang="scss" scoped />

<template>
  <ModalVue ref="modal">
    <div class="modal-header">
      <h3>Clonar</h3>

      <v-btn @click="close" icon x-small>
        <v-icon x-small v-text="'fi-br-cross'" />
      </v-btn>
    </div>

    <SelectVue
      label="Nó de Destino"
      :value="target"
      :onChange="onSelectNode"
      :options="options"
    />

    <SelectVue
      label="Nó de Destino"
      :value="target"
      :onChange="onSelectNode"
      :options="options"
    />
  </ModalVue>
</template>
<script>
import ModalVue from '@/components/Modal/Modal.vue'
import SelectVue from '@/components/VueSelect/VueSelect.vue'

const DEFAULT_NODE = { name: '', image: null }

export default {
  name: 'EditNode',
  components: {
    ModalVue,
    SelectVue,
  },
  data() {
    return {
      node: DEFAULT_NODE,
      target: { value: null, label: null },
      options: [
        { value: 'value0', label: 'label0' },
        { value: 'value1', label: 'label1' },
        { value: 'value2', label: 'label2' },
      ],
    }
  },
  computed: {
    modal() {
      return this.$refs.modal
    },
  },
  methods: {
    onSelectNode() {},
    open() {
      this.modal.open()
    },
    close() {
      this.modal.close()
    },
  },
}
</script>

<style src="./style.scss" lang="scss" scoped />

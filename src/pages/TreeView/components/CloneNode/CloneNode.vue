<template>
  <ModalVue ref="modal">
    <div class="modal-header">
      <h3>Clonar</h3>

      <v-btn @click="close" icon x-small>
        <v-icon x-small v-text="'fi-br-cross'" />
      </v-btn>
    </div>

    <SelectVue
      label="Nó destino"
      optValue="id"
      optLabel="name"
      :value="target"
      :options="options"
      :onChange="onChange"
    />

    <div class="actions">
      <button @click="close" icon x-small>
        Cancelar <v-icon x-small v-text="'fi-br-cross'" />
      </button>

      <button @click="handleCopy" icon x-small>
        Salvar <v-icon x-small v-text="'fi-br-check'" />
      </button>
    </div>
  </ModalVue>
</template>
<script>
import ModalVue from '@/components/Modal/Modal.vue'
import SelectVue from '@/components/VueSelect/VueSelect.vue'
import { flatTree, uuid } from '@/__mocks__/TableTree'

export default {
  name: 'EditNode',
  components: {
    ModalVue,
    SelectVue,
  },
  data() {
    return {
      nodeToClone: null,
      target: {},
      options: flatTree,
    }
  },
  computed: {
    modal() {
      return this.$refs.modal
    },
  },
  methods: {
    handleCopy() {
      this.nodeToClone.children = []
      this.nodeToClone._children = []
      this.nodeToClone.childrenCount = 0
      this.nodeToClone.id = uuid(40)

      this.nodeToClone.success(this.target)
      this.modal.close()
    },
    onChange(selected) {
      this.target = selected !== null ? selected : {}
    },
    open(nodeToClone) {
      this.nodeToClone = nodeToClone
      this.modal.open()
    },
    close() {
      this.nodeToClone = null
      this.modal.close()
    },
  },
}
</script>
<style src="./style.scss" lang="scss" scoped />

<template>
  <ModalVue ref="modal">
    <div class="modal-header">
      <h3>Mover</h3>

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

      <button @click="handleMove" icon x-small>
        Salvar <v-icon x-small v-text="'fi-br-check'" />
      </button>
    </div>
  </ModalVue>
</template>
<script>
import ModalVue from '@/components/Modal/Modal.vue'
import SelectVue from '@/components/VueSelect/VueSelect.vue'
import { flatten, extractChildren } from '@/__mocks__/TableTree'

export default {
  name: 'MoveNode',
  components: {
    ModalVue,
    SelectVue,
  },
  data() {
    return {
      nodeToMove: null,
      target: {},
      options: [],
    }
  },
  inject: ['tree'],
  computed: {
    modal() {
      return this.$refs.modal
    },
  },
  methods: {
    handleMove() {
      this.nodeToMove.success(this.target)
      this.modal.close()
    },
    onChange(selected) {
      this.target = selected !== null ? selected : {}
    },
    open(nodeToMove) {
      this.nodeToMove = nodeToMove
      this.options = flatten(
        extractChildren({ children: this.tree }),
        extractChildren,
        this.nodeToMove
      )

      this.modal.open()
    },
    close() {
      this.nodeToMove = null
      this.modal.close()
    },
  },
}
</script>
<style src="./style.scss" lang="scss" scoped />

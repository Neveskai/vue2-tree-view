<template>
  <ModalVue ref="modal">
    <div class="modal-header">
      <h3>Deletar</h3>

      <v-btn @click="close" icon x-small>
        <v-icon x-small v-text="'fi-br-cross'" />
      </v-btn>
    </div>

    <div class="text">
      Deseja realmente deletar o nó <b>{{ node.name }}</b> e todos os seus
      filhos
    </div>

    <div class="actions">
      <button @click="close" icon x-small>
        Cancelar <v-icon x-small v-text="'fi-br-cross'" />
      </button>

      <button @click="handleCopy" icon x-small>
        Deletar <v-icon x-small v-text="'fi-br-trash'" />
      </button>
    </div>
  </ModalVue>
</template>
<script>
import ModalVue from '@/components/Modal/Modal.vue'

export default {
  name: 'DeleteNode',
  components: {
    ModalVue,
  },
  data() {
    return {
      node: { name: '' },
    }
  },
  computed: {
    modal() {
      return this.$refs.modal
    },
  },
  methods: {
    handleCopy() {
      this.node.success(this.node)
      this.modal.close()
    },
    open(node) {
      this.node = node
      this.modal.open()
    },
    close() {
      this.node = null
      this.modal.close()
    },
  },
}
</script>
<style src="./style.scss" lang="scss" scoped />

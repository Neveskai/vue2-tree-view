<template>
  <ModalVue ref="modal">
    <div class="modal-header">
      <h3>Editar</h3>

      <v-btn @click="close" icon x-small>
        <v-icon x-small v-text="'fi-br-cross'" />
      </v-btn>
    </div>

    <TextField
      label="Nome"
      :value="node.name"
      :onChange="v => (node.name = v)"
    />

    <TextField
      label="Icone"
      :value="node.image"
      :onChange="v => (node.image = v)"
    />

    <div class="icon-preview" v-if="node.image">
      <label>Icone Pré visualização</label>
      <v-img :src="node.image" aspect-ratio="16/9" cover />
    </div>

    <div class="actions">
      <button @click="close" icon x-small>
        Cancelar <v-icon x-small v-text="'fi-br-cross'" />
      </button>

      <button @click="handleSave" icon x-small>
        Salvar <v-icon x-small v-text="'fi-br-check'" />
      </button>
    </div>
  </ModalVue>
</template>
<script>
import colors from '@/styles/abstracts/temp.js'
import TextField from '@/components/TextField/TextField.vue'
import ModalVue from '@/components/Modal/Modal.vue'

const DEFAULT_NODE = { name: '', image: null }

export default {
  name: 'EditNode',
  components: {
    TextField,
    ModalVue,
  },
  data() {
    return {
      node: DEFAULT_NODE,
      rules: {
        required: v => !!v || this.$t('required'),
        length: len => v =>
          v?.length <= len || this.$t('length', this.rules._length),
        _length: 0,
      },
      colors: colors,
    }
  },
  computed: {
    modal() {
      return this.$refs.modal
    },
  },
  methods: {
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
}
</script>

<style src="./style.scss" lang="scss" scoped />

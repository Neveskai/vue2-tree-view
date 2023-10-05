<template>
  <section class="modal-container" v-if="visible">
    <div class="modal-overlay"></div>

    <div class="modal-body">
      <div class="modal-header">
        <h3>Editar</h3>

        <v-btn @click="node.cancel" icon x-small>
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
        <button @click="node.cancel" icon x-small>
          Cancelar <v-icon x-small v-text="'fi-br-cross'" />
        </button>

        <button @click="handleSave" icon x-small>
          Salvar <v-icon x-small v-text="'fi-br-check'" />
        </button>
      </div>
    </div>
  </section>
</template>
<script>
import colors from '@/styles/abstracts/temp.js'
import TextField from '../TextField/TextField.vue'

const DEFAULT_NODE = { name: '', image: null }

export default {
  name: 'ModalVue',
  components: {
    TextField,
  },
  data() {
    return {
      node: DEFAULT_NODE,
      visible: false,
      rules: {
        required: v => !!v || this.$t('required'),
        length: len => v =>
          v?.length <= len || this.$t('length', this.rules._length),
        _length: 0,
      },
      colors: colors,
    }
  },
  methods: {
    handleSave() {
      const node = {
        name: this.node.name,
        image: this.node.image,
      }

      this.node.success(node)
      this.close()
    },
    open(_node) {
      this.node = _node
      this.visible = true

      return _node
    },
    close() {
      this.visible = false
      this.node = DEFAULT_NODE
    },
  },
}
</script>

<style src="./style.scss" lang="scss" scoped />

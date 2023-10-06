<template>
  <div class="tree-node">
    <TextIcon class="text-icon" :label="node.name" :image="node.image" />

    <div class="children-count">{{ hasChildren }}</div>

    <div class="add-new-node" @click="handleAction('add')">+</div>

    <div class="edit-node" @click="handleAction('edit')">
      <i class="fi-br-pencil"></i>
    </div>

    <div class="clone-node" @click="handleAction('clone')">
      <i class="fi-br-copy-alt"></i>
    </div>

    <div class="move-node" @click="handleAction('move')" v-if="!node.root">
      <i class="fi-br-exchange"></i>
    </div>

    <div class="delete-node" @click="handleAction('delete')" v-if="!node.root">
      <i class="fi-br-trash"></i>
    </div>

    <div
      v-if="hasChildren"
      class="show-children"
      @click="toggleChildren(node, visibleChildren)"
    >
      <span :class="{ rotate180: visibleChildren, normal: !visibleChildren }">
        <i class="fi-br-arrow-small-down"></i>
      </span>
    </div>
  </div>
</template>
<script>
import TextIcon from '@/components/TextIcon/TextIcon.vue'
import moment from 'moment'

export default {
  name: 'TreeNode',
  inject: ['toggleChildren'],
  components: {
    TextIcon,
  },
  props: {
    node: {
      type: Object,
    },
  },
  methods: {
    handleAction(act) {
      this.$emit('treeAction', act, this.node)
    },
  },
  computed: {
    updatedAt() {
      return moment(this.node.updatedAt).format('DD/MM/YYYY')
    },
    name() {
      return { label: this.node.name, image: this.node.image }
    },
    visibleChildren() {
      return !!this.node?.children.length
    },
    hasChildren() {
      return this.node?.childrenCount
    },
  },
  mounted() {
    this.toggleChildren(this.node)
  },
}
</script>

<style lang="scss" scoped src="./style.scss" />

<template>
  <div id="treeview-page" class="overflow-hidden">
    <TreeView
      ref="tree"
      :tree="tree"
      :hooks="hooks"
      :config="treeConfig"
      :loading="loading"
      class="mt-1"
    >
      <template v-slot:search>
        <TreeSearch ref="treeSearch" v-bind="searchConfig" />
      </template>

      <template v-slot:zoom="{ zoomScale }">
        <ZoomController ref="zoom" :zoomScale="zoomScale" :help="help" />
      </template>

      <template v-slot:nodes="{ node }">
        <QuickNewNode
          v-if="node.quickNewNode"
          :node="node"
          @treeAction="treeActions"
        />
        <TreeNode
          v-else
          :node="node"
          :config="treeConfig"
          @treeAction="treeActions"
        />
      </template>
    </TreeView>

    <FloatingAlert ref="alertBar" />
    <CloneNode ref="cloneModal" />
    <EditNode ref="editModal" />
    <MoveNode ref="moveModal" />
  </div>
</template>
<script>
import QuickNewNode from './components/QuickNewNode/QuickNewNode.vue'
import TreeSearch from './components/TreeSearch/TreeSearch.vue'
import TreeNode from './components/TreeNode/TreeNode.vue'
import EditNode from './components/EditNode/EditNode.vue'
import CloneNode from './components/CloneNode/CloneNode.vue'
import MoveNode from './components/MoveNode/MoveNode.vue'

import ZoomController from '@/components/TreeView/parts/ZoomController.vue'
import FloatingAlert from '@/components/FloatingAlert/FloatingAlert.vue'
import TreeView from '@/components/TreeView/TreeView.vue'

import { tree } from '@/__mocks__/TableTree.js'

export default {
  name: 'TreeViewPage',
  components: {
    EditNode,
    MoveNode,
    CloneNode,
    TreeView,
    TreeNode,
    TreeSearch,
    QuickNewNode,
    ZoomController,
    FloatingAlert,
  },
  computed: {
    _tree() {
      return this.$refs.tree
    },
    _editModal() {
      return this.$refs.editModal
    },
    _cloneModal() {
      return this.$refs.cloneModal
    },
    _moveModal() {
      return this.$refs.moveModal
    },
  },
  data() {
    return {
      tree,
      treeConfig: { nodeWidth: 260, nodeHeight: 180, levelHeight: 220 },
      loading: true,
      hooks: {},
      searchConfig: {},
    }
  },
  mounted() {
    this.$refs.tree?.resetTree()

    setTimeout(() => {
      this.loading = false
    }, 500)
  },
  methods: {
    treeActions(act, refNode = null) {
      if (!refNode) refNode = this.tree[0]

      const actions = {
        add: this.addQuickNewNode,
        edit: this.editNode,
        move: this.moveNode,
        clone: this.cloneNode,
      }

      return actions[act](refNode)
    },
    treeAlerts(act, status, node) {
      const messages = {
        add: { messagePrefix: this.$t('added') },
        edit: { messagePrefix: this.$t('edited') },
      }

      const config = {
        description: node.title,
        type: status,
        ...messages[act],
      }

      this.$refs.alertBar.displayAlert(config)
    },
    addQuickNewNode(refNode) {
      const node = this.$refs.tree.insertCopy(
        { quickNewNode: true },
        refNode,
        true
      )

      node.cancel = () => this.$refs.tree.removeNode(node)
      node.success = newNode => {
        newNode.childrenCount = 0
        refNode.childrenCount += 1

        this.$refs.tree.overrideNode(newNode, node)
        this.treeAlerts('add', 'success', node)
      }
    },
    editNode(refNode) {
      const node = { ...refNode }

      this._editModal.open(node)

      node.success = newNode => {
        this.$refs.tree.editNode(newNode, refNode)
        this.treeAlerts('edit', 'success', refNode)
      }
    },
    cloneNode(refNode) {
      const node = { ...refNode }

      this._cloneModal.open(node)

      node.success = cloneTarget => {
        cloneTarget.childrenCount += 1

        this.$refs.tree.insertCopy(node, cloneTarget, true)
        this.treeAlerts('clone', 'success', refNode)
      }
    },
    moveNode(refNode) {
      const node = { ...refNode }

      this._moveModal.open(node)

      node.success = moveTarget => {
        refNode.childrenCount -= 1
        moveTarget.childrenCount += 1

        this.$refs.tree.moveNode(refNode, moveTarget, true)
        this.treeAlerts('move', 'success', refNode)
      }
    },
    deleteNode(refNode) {
      const node = { ...refNode }

      this._deleteModal.open(node)

      node.success = () => {
        const parent = this.$refs.tree.removeNode(refNode)

        parent.childrenCount -= 1

        this.treeAlerts('delete', 'success', refNode)
      }
    },
    initTreeSearch() {
      const submit = async () => {}
      const search = async () => {}

      return { submit, search }
    },
    help() {
      console.log('help')
    },
  },
}
</script>

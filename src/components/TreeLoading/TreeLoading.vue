<template>
  <div class="tree-loading__content">
    <div class="tree-loading tree-loading__root">
      <v-skeleton-loader type="list-item-avatar" />
    </div>

    <div class="d-flex">
      <div class="tree-loading tree-loading__node">
        <v-skeleton-loader type="list-item-avatar" />
      </div>
      <div class="tree-loading tree-loading__node">
        <v-skeleton-loader type="list-item-avatar" />
      </div>
      <div class="tree-loading tree-loading__node">
        <v-skeleton-loader type="list-item-avatar" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TreeLoading',
  data() {
    return {
      dataset: {
        root: true,
        children: [{}],
      },
      config: { nodeWidth: 301, nodeHeight: 201, levelHeight: 250 },
    }
  },
}
</script>
<style scoped src="./style.scss" lang="scss" />

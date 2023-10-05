<template>
  <div class="ml-2">
    <input :value="search" placeholder="Pesquise os familiares" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      search: '',
    }
  },
}
</script>

<style src="./style.scss" lang="scss" scoped />

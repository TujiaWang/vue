<template>
  <el-menu class="el-menu-vertical-demo">
    <subitem :item="menus" />
  </el-menu>
</template>
<script>
import subitem from "./subitem";
export default {
  components: {
    subitem,
  },
  props: {
    menus: Array,
  },
  data() {
    return {};
  },
};
</script>

<style lang="less"></style>

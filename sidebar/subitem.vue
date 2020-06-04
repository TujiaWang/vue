<template>
  <div class="navMenu">
    <div v-for="(navMenu, idx) in item" :key="idx">
      <el-submenu
        v-if="navMenu.children && navMenu.children.length > 0"
        :index="navMenu.path"
      >
        <template slot="title">
          <i class="el-icon-location"></i>
          <span> {{ navMenu.label }}</span>
        </template>
        <subitem :item="navMenu.children" />
      </el-submenu>
      <el-menu-item :index="navMenu.path" v-else>
        <i class="el-icon-location"></i>
        <span slot="title">{{ navMenu.label }}</span>
      </el-menu-item>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: Array,
  },
  name: "subitem",
  data() {
    return {};
  },
};
</script>

<style lang="less"></style>

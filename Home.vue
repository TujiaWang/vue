<template>
  <div class="home">
    <Table :loading="loading" :table="table" :page="page"></Table>
  </div>
</template>

<script>
import mixins from '../common/mixins'
import Table from "@/components/Table.vue";

export default {
  name: "home",
  mixins:[mixins],
  components: {
    Table
  },
  data() {
    return {
      table: {
        thead: [
          { type: "selection", width: 55 },
          { label: "编号", attr: "id" },
          { label: "头像", attr: "logo",type:'img',width:100,height:100 },
          { label: "头像预览", attr: "logo",type:'popimg',width:100,height:100 },
          { label: "昵称", attr: "name",showOverflowTooltip:true },
          { label: "日期", attr: "date" },
          { label: "地址", attr: "address", formatter: this.formatterAddress },
          {
            label: "操作",
            buttons: [
              {
                label: "编辑",
                type:'primary',
                plain:true,
                size:'mini',
                event: this.edit,
                show: row => {
                  return row["id"] > 2;
                }
              },
              { label: "删除",type:'danger',round:true,size:'small', event: this.del },
              { label: "默认",size:'mini',event: this.del },
              { label: "查看",type:'info',size:'mini',circle:true,icon:'el-icon-message', event: this.del }
            ]
          }
        ],
        tableData: [
          {
            id: 1,
            logo:
              "https://tujiawang.github.io/medias/logo.png",
            name: "zhangsan zhangsan zhangsan zhangsan zhangsan zhangsan",
            date: "2019-11-07",
            address: "wuhan"
          },
          {
            id: 2,
            logo:
              "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
            name: "zhangsan",
            date: "2019-11-07",
            address: "wuhan"
          },
          {
            id: 3,
            logo:
              "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
            name: "zhangsan",
            date: "2019-11-07",
            address: "wuhan"
          },
          {
            id: 4,
            logo:
              "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
            name: "zhangsan",
            date: "2019-11-07",
            address: "wuhan"
          }
        ],
        sortevent: this.tableSort
      }
    };
  },
  methods: {
    formatterAddress(row, column) {
      return row[column.property] + '2222';
    },
  }
};
</script>

# element-ui使用时对于表格的封装
首先将表格改造如下：
~~~
// Table.vue
<template>
	<div class="table-page">
		<el-table :data="table.tableData" border @sort-change="table.sortevent" :loading="loading" style="width: 100%;">
			<template v-for="(item,index) in table.thead">
                <!-- 多选框 -->
                <el-table-column type="selection" :width="item.width" v-if="item.type == 'selection'" :key="index"></el-table-column>
                <!-- 显示图片 -->
                <el-table-column :prop="item.attr" :fixed="item.fixed" :label="item.label" :width="item.width" v-else-if="item.type == 'img'" :key="index">
                    <template slot-scope="scope">
                        <el-image :style="{width: scope.row[item.width]+'px',height:scope.row[item.height]+'px'}" :src="scope.row[item.attr]" :fit="scope.row[item.fit]"></el-image>
                    </template>
                </el-table-column>
                <!-- 预览图片 -->
                <el-table-column :prop="item.attr" :fixed="item.fixed" :label="item.label" :width="item.width" v-else-if="item.type == 'popimg'" :key="index">
                    <template slot-scope="scope">
                        <el-popover :placement="scope.row[item.placement]" :trigger="scope.row[item.trigger]">
                            <el-image :src="scope.row[item.attr]" :fit="scope.row[item.fit]"></el-image>
                            <el-image :style="{width: scope.row[item.width]+'px',height:scope.row[item.height]+'px'}" :src="scope.row[item.attr]" :fit="scope.row[item.fit]" slot="reference"></el-image>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 操作按钮 -->
				<el-table-column align="center" fixed="right" :width="item.width" :label="item.label" v-else-if="item.buttons" :key="index">
					<template slot-scope="scope">
						<template v-for="(btn,index_) in item.buttons">
                            <!-- element-ui的朴素按钮 -->
                            <template v-if="btn.plain">
                                <el-button :type="btn.type" :size="btn.size" :icon="btn.icon" @click="btn.event(scope.row)" plain :key="index_" v-if="btn.show ? btn.show(scope.row) : true">{{btn.label}}</el-button>
                            </template>
                            <!-- element-ui的圆角按钮 -->
                            <template v-else-if="btn.round">
                                <el-button :type="btn.type" :size="btn.size" :icon="btn.icon" @click="btn.event(scope.row)" round :key="index_" v-if="btn.show ? btn.show(scope.row) : true">{{btn.label}}</el-button>
                            </template>
                            <!-- element-ui的圆形按钮 -->
                            <template v-else-if="btn.circle">
                                <el-button :type="btn.type" :size="btn.size" :icon="btn.icon" @click="btn.event(scope.row)" circle :key="index_" v-if="btn.show ? btn.show(scope.row) : true"></el-button>
                            </template>
                            <!-- element-ui的默认按钮 -->
                            <template v-else>
                                <el-button :type="btn.type" :size="btn.size" :icon="btn.icon" @click="btn.event(scope.row)" :key="index_" v-if="btn.show ? btn.show(scope.row) : true">{{btn.label}}</el-button>
                            </template>
                        </template>
					</template>
				</el-table-column>
				<el-table-column :sortable="item.sort" align="center" :prop="item.attr" :fixed="item.fixed" :width="item.width" :formatter="item.formatter" :label="item.label" :show-overflow-tooltip="item.showOverflowTooltip" v-else :key="index">
				</el-table-column>
			</template>
		</el-table>
        <!-- 分页数据 -->
        <el-pagination @size-change="page.sizeChange" @current-change="page.currentChange" :current-page="page.currentPage" prev-text="上一页" next-text="下一页" :page-sizes="page.pageSizes" :page-size="page.pageSize" :pager-count="5" layout="sizes, total, prev, pager, next, jumper" :total="page.total" v-if="table.tableData.length > 0">
		</el-pagination>
	</div>
</template>
<script>
	export default {
		props: {
            table: Object,
            page: Object,
			loading: Boolean
		}
	}
</script>
<style scoped>
</style>
~~~
添加vue中的混入，如下：
~~~
// mixins.js
export default {
    data(){
        return {
          page:{
            pageSize:10,//偏移，页面数据个数
            pageSizes:[10,30,50,100,200],
            currentPage:1,//当前页数
            total:0,//总数据量
            sizeChange:this.handleSizeChange,
            currentChange:this.handleCurrentChange
          },
          loading:false,
          sortAttr:{sort:null,dir:null},//升序，降序
          searchFileds:{},//搜索条件
        }
    },
    watch:{
      'page.currentPage':function(){
        this.getList()
      },
      'page.pageSize':function(){
        this.getList()
      },
      '$route.query':function(val){
        if(val.reflist){
          this.refresh()
        }
      }
    },
    methods:{
        // 获取列表数据
      getList(){
        var index = this.page.currentPage;
        this.loading = true;
        this.searchFileds = {}
        //遍历获取输入框参数
        if(this.search.input){
          this.search.input.map(v => {
            if(v.value){
              if(v.number){
                this.searchFileds[v.attr] = isNaN(+v.value)?v.value:+v.value
              }else{
                this.searchFileds[v.attr] = v.value
              }
            }
          })
        }
        // 遍历获取下拉框的参数
        if(this.search.select){
          this.search.select.map(v => {
            if(v.value){
              if(v.number){
                this.searchFileds[v.attr] = isNaN(+v.value)?v.value:+v.value
              }else{
                this.searchFileds[v.attr] = v.value
              }
            }
          })
        }
        // 遍历获取日期参数
        if(this.search.date){
          this.search.date.map(v => {
            if(v.value){
              if(v.type=="daterange"){
                this.searchFileds[v.attr[0]] = v.value[0];
                this.searchFileds[v.attr[1]] = v.value[1];
              }else{
                this.searchFileds[v.attr] = v.value
              }
            }
          })
        }
        // 合并默认搜索参数和输入搜索参数
        if(this.searchDefault){
          Object.assign(this.searchFileds,this.searchDefault)
        }
        let opt = {page:index,pageSize:this.page.pageSize,sort:this.sortAttr.sort,dir:this.sortAttr.dir,searchFileds:this.searchFileds}
        // console.log(this.searchFileds)
        this.$http.post(this.listUrl,opt).then(res=>{
          this.loading = false;
          let resDate = res.data.data || [];
        //   可以在页面中使用该函数格式化数据
          if(this.handleTableData){
            let newData = this.handleTableData(resDate)
            if(newData){
              resDate = newData
            }
          }
          this.page.total = res.data.totalCount || 0;
          this.table.tableData = this.tableStorage[index] || [];
        }).catch(()=>{
          this.loading = false;
        })
      },
      resetFrom(){ // 清空搜索选项
        if(this.search.input){
          this.search.input.map(v=>{
            if(v.type != 'hidden'){
              v.value = ''
            }
          })
        }
        if(this.search.select){
          this.search.select.map(v=>{
            v.value = ''
          })
        }
        if(this.search.date){
          this.search.date.map(v=>{
            v.value = ''
          })
        }
        this.searchFileds = {}
        this.refresh()
      },
      refresh(){
        if(this.listUrl){
          this.page.currentPage = 1;
          this.tableStorage = [];
          this.getList()
        }
      },
      handleSizeChange(val){
        this.page.pageSize = val
      },
      handleCurrentChange(val){
        this.page.currentPage = val
      },
    //   排序处理
      tableSort(val){
        let isAttr = (/^_/.exec(val.prop) || [])[0];
        this.sortAttr.sort = isAttr?val.prop.substr(1):val.prop;
        if(val.order === 'ascending'){
          this.sortAttr.dir = 'asc';
        }else if(val.order === 'descending'){
          this.sortAttr.dir = 'desc'
        }else{
          this.sortAttr.dir = val.order
        }
        this.refresh()
      },
      del(data){
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          let key = 'id';
          let valueKey = this.delKey || key;
          this.$http.get(this.delUrl,{params:{ids:data[valueKey]}}).then(res=>{
            this.$message({
              type: res.data.status == '3'?'success':'error',
              message: res.data.msg || '删除成功!'
            });
            this.refresh()
          })
        })
      }
    }
}
~~~
使用如下：
~~~
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
~~~
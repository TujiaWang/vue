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
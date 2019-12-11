# 导出表格数据
有时候在做后台项目的时候通常会有这样一个需求，需要把很多用户筛选出来的数据导出进行传递，其实可以利用原声js实现的，今天只是记录一下使用插件实现的方法，毕竟插件兼容好开放速度会快一点的。
主要使用到两个插件：file-saver xlsx
- file-saver 负责保存文件
- xlsx负责将数据转为表格
## 具体使用
### 安装
npm install -S file-saver xlsx
npm install -D script-loader
> script-loader主要是为了如果xlsx和file-saver不能加载可以使用这个，貌似现在只需import就可以了。
### 封装导出代码
~~~
import fs from 'file-saver'
import XLSX from 'xlsx'
export default (json, fields, filename = '测试数据.xlsx') => {
    json.forEach(item => {
        for (let i in item) {
            if (fields.hasOwnProperty(i)) {
                item[fields[i]] = item[i];
            }
            delete item[i]; //删除原先的对象属性
        }
    })
 
    let sheetName = filename //excel的文件名称
    let wb = XLSX.utils.book_new()  //工作簿对象包含一SheetNames数组，以及一个表对象映射表名称到表对象。XLSX.utils.book_new实用函数创建一个新的工作簿对象。
    let ws = XLSX.utils.json_to_sheet(json, { header: Object.values(fields) }) //将JS对象数组转换为工作表。
    wb.SheetNames.push(sheetName)
    wb.Sheets[sheetName] = ws
    const defaultCellStyle = { font: { name: "Verdana", sz: 13, color: "FF00FF88" }, fill: { fgColor: { rgb: "FFFFAA00" } } };//设置表格的样式
    let wopts = { bookType: 'xlsx', bookSST: false, type: 'binary', cellStyles: true, defaultCellStyle: defaultCellStyle, showGridLines: false }  //写入的样式
    let wbout = XLSX.write(wb, wopts)
    let blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    fs.saveAs(blob, filename + '.xlsx')
}
const s2ab = s => {
    if (typeof ArrayBuffer !== 'undefined') {
        var buf = new ArrayBuffer(s.length)
        var view = new Uint8Array(buf)
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
        return buf
    } else {
        var buf = new Array(s.length);
        for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
}
~~~
### 具体页面使用
使用前先引入自己写好的封装文件，然后再相应地方调用即可。
import Export from "../../utils/export";
~~~
 exportToExcel() {
      let fields = {
        date: "日期",
        name: "姓名",
        province: "省12",
        area: "地区",
        address: "地址",
        code: "邮编",
        test: "测试"
      };
    //   let data = JSON.parse(JSON.stringify(this.tableData3));  // 如果直接放置数据不行请加上这句
      Export(this.tableData3, fields, "测试");
    }
~~~

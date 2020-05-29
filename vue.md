# vue开发中常见问题和技巧
## element UI 自定义传参的解决方法
这里的handleSelect默认绑定的参数是选中的那条数据。如果一个页面有好几个相同的组件，要想知道选的是哪个？
~~~
<el-autocomplete
    v-model="state4"
    :fetch-suggestions="querySearchAsync"
    placeholder="请输入内容"
    @select="handleSelect"
></el-autocomplete>
~~~
解决方案：
~~~
<el-autocomplete
    v-model="state4"
    :fetch-suggestions="querySearchAsync"
    placeholder="请输入内容"
    @select="((item)=>{handleSelect(item, index)})"
    // 写个闭包就可以了，index表示第几个组件
></el-autocomplete>
~~~
## element-UI 框架 el-input 触发不了 @key.enter事件
~~~
<el-input v-model="form.loginName" 
placeholder="账号" 
@keyup.enter="doLogin">
</el-input>
~~~
解决方案：使用@key.center.native
~~~
<el-input v-model="form.loginName"
placeholder="账号" 
@keyup.enter.native="doLogin">
</el-input>
~~~

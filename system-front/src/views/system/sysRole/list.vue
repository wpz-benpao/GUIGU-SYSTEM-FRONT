<template>
  <div class="app-container">
    <!--查询表单-->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称">
              <el-input style="width:30%" v-model="searchObj.roleName" placeholder="角色名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini"  @click="fetchData()">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
        </el-row>
      </el-form>
    </div>
    <!-- 工具条 -->
    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add">添 加</el-button>
      <el-button class="btn-add" size="mini" @click="batchRemove()" >批量删除</el-button>
    </div>

    <!-- 表格 -->
    <!--v-loading="listLoading"中的listLoading为true时表示显示加载-->
    <el-table
      v-loading="listLoading"  
      :data="list"
      stripe
      border
      style="width: 100%;margin-top: 10px;"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection"/>
      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="roleCode" label="角色编码" />
      <el-table-column prop="createTime" label="创建时间" width="160"/>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)" title="修改"/>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)" title="删除"/>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%" >
      <el-form ref="dataForm" :model="sysRole" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item label="角色名称">
          <el-input v-model="sysRole.roleName"/>
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="sysRole.roleCode"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" @click="saveOrUpdate()" size="small">确 定</el-button>
      </span>
    </el-dialog>
      <!-- 分页组件 -->
    <el-pagination
        :current-page="page"
        :total="total"
        :page-size="limit"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="fetchData"
    />
  </div>
</template>

<script>
import api from '@/api/system/role'
export default {
    //定义初始值
    data(){
        return{
            listLoading:true,
            list:[],//角色列表
            total:0,//总记录数
            page:1,//当前页
            limit:3,//每页显示记录数
            searchObj:{},//条件查询封装对象
            dialogVisible:false,

            sysRole:{}, //封装添加的表单数据
            selectionValue:[] //复选框选择内容封装数组
        }
    },

    //页面渲染之前执行
    created(){
         this.fetchData()
    },
    //具体方法
    methods:{
        //复选框发生变化
        handleSelectionChange(selection){
          this.selectionValue=selection
          console.log(this.selectionValue)
        },
        //批量删除
        batchRemove(){
          if(this.selectionValue.length==0){
            this.$message.warning('请选择要删除的记录！')
          }else{
            this.$confirm('此操作将永久删除选中的角色, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              var ids=[]
              //获取多个复选框对应的id值并封装到数组中
              for(var i=0;i<this.selectionValue.length;i++){
                var id=this.selectionValue[i].id
                ids.push(id)
              }
              api.BatchRemove(ids).then(response=>{
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.fetchData()
              })          
            }) 
          }
        },


        //条件分页查询列表
        //pageNum查询页数
        fetchData(pageNum=1){
            //页数赋值
            this.page=pageNum
            //ajax
            api.getPageList(this.page,this.limit,this.searchObj)
            .then(response => {
                this.listLoading=false
                //console.log(response)
                //每页数据列表，为什么是response.data.records，要看浏览器开发者模式中响应数据的参数
                this.list=response.data.records
                //总记录数，为什么是response.data.total，要看浏览器开发者模式中响应数据的参数
                this.total=response.data.total

            })
        },
        //重置
        resetData(){
            //清空表单
            this.searchObj={}
            //查询所有数据
            this.fetchData()
        },
        removeDataById(id){
          
          this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.removeById(id).then(response=>{
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          this.fetchData()
          })          
        })          
        },
        add(){
          this.dialogVisible=true
          this.sysRole={}
        },
        edit(id){
          this.dialogVisible=true
          api.findRoleById(id).then(response=>{
            this.sysRole=response.data
          })
        },

        saveOrUpdate(){
          if(!this.sysRole.id){
            this.saveRole()
          }else{
            this.updateRole()
          }
        },

        saveRole(){
          api.saveRole(this.sysRole).then(response=>{
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.dialogVisible=false
            this.fetchData()
          })
        },

        updateRole(){
          api.updateRole(this.sysRole).then(response=>{
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.dialogVisible=false
            this.fetchData()
          })
        }
    }
}
</script>
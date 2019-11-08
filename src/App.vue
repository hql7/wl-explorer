<template>
  <div id="app">
    <wlExplorer
      ref="wl-explorer-cpt"
      :headerDropdown="headerHandle"
      :columns="file_table_columns"
      :all-path="all_folder_list"
      :is-folder-fn="isFolderFn"
      :folderType="rource_type"
      :data="file_table_data"
      :props="explorer_prop"
      @handleFolder="handleFolder"
      @search="fileSearch"
      @del="fileDel"
      @closeFade="closeOtherLayout(fade)"
    ></wlExplorer>
  </div>
</template>

<script>
import wlExplorer from '@/pages/WlExplorer'; // 导入文件管理器
import { closeOtherLayout, arrayToTree } from '@/util'; // 导入关闭其他弹出类视图函数
import { 
  getFileListApi, // 1获取文件夹列表
  // addFolderApi, // 2新增文件夹
  getAllFoldersApi, // 4获取全部文件夹
  delFileApi, // 6删除文件|文件夹
} from '@/api'; // 导入接口
// const guid = '00000000-0000-0000-0000-000000000000';
const apiok = 200;

export default {
  name: 'app',
  components: {
    wlExplorer
  },
  data() {
    const _GB = 1024*1024;
    // const vm = this;
    return {
      headerHandle: [
        { name: '权限', command: 'auth'},
      ], // 头部按钮更多操作-自定义权限
      file_table_columns: [
        {
          label: '名称', 
          prop: 'Name', 
          minWidth: 120
        },
        {
          label: '修改日期', 
          align: 'center', 
          width: 120,
          formatter(row){
            return row.EditTime.split('T')[0] || '-'
          }
        },
        {
          label: '类型', 
          align: 'center',
          width: 90,
          formatter(row){
            return row.Type === 1 ? '文件夹' : row.SuffixName;
          }
        },
        {
          label: '大小', 
          minWidth: 90,
          align: 'center', 
          formatter(row){
            if(row.Size === null) return '-'
            if(row.Size < 1024){ // 1024以下显示kb
              return row.Size + 'KB';
            }
            if(row.Size < _GB){ // 1024*1024
              let _mb = (row.Size/1024).toFixed(2);
              return  parseFloat(_mb) + 'MB';
            }
            let _gb = (row.Size/_GB).toFixed(2);
            return parseFloat(_gb) + 'GB';
          }
        },
        {
          label: '创建日期', 
          align: 'center', 
          width: 120,
          formatter(row){
            return row.CreateTime.split('T')[0] || '-'
          }
        },
        {
          label: '作者', 
          minWidth: 100,          
          align: 'center', 
          formatter(row){
            return row.CreateUserName || '-'
          }
        },
        {
          label: '描述', 
          minWidth: 100,          
          formatter(row){
            return row.Describe || '-'
          }
        },
      ], // 自定义表格列
      file_table_data: [], // 表格数据      
      all_folder_list: [], // 所有文件夹列表
      tree_folder_list: [], // 树形文件夹列表
      type: {
        folder: 1,
        img: 2,
        video: 3,
        other: 4
      }, // 文件类型
      rource_type: {
        self: 1, // 自建
      }, // 数据来源类型
      explorer_prop: {
        name: "Name", 
        match: "Name", 
        splic: true,
        suffix: "SuffixName",
        pathId: "Id",
        pathPid: "ParentId",
        pathName: "Name",
      }, // 文件管理器配置项
    }
  },
  methods: {
    /**
     * 根据关键词搜索文件
     * file: Object 文件属性
     * update: Boolean 数据是否需要更新（不需要表示已存在）
     */
    fileSearch(file, update){
      if(update){
        this.path = file;
        this.getFileList();
      }
    },
    // 获取文件夹列表
    getFileList(){
      getFileListApi().then(({data}) => {
        if(data.StatusCode === apiok){
          this.file_table_data = data.Data || [];
        }
      })
    },
    /**
     * 编辑文件夹
     * act:Object 当前选中文件夹
     * type:String 操作类型 add添加edit编辑
     * file:Object 当前路径信息
     * auth:Boolean 是否只更改文件夹权限
     */
    handleFolder(act, type, file, auth){
      this.path = file;
      this.just_edit_auth = auth;
      this.fade.folder = true;
      if(type === 'add'){
        this.$refs['folder_form'].resetFields();
        this.folder_form.Id = '';
        this.folder_form.ParentId = file.id;
        this.folder_form.RourceType = this.rource_type.self;
        return;
      }
      this.child_act_saved = act;
    },
    // 删除文件
    fileDel(data){
      let cannot_del_data = []; // 收集不可删除数据
      let normal_data_file = []; // 收集可删除文件
      let normal_data_folder = []; // 收集可删除文件夹
      data.forEach(i => {
        i.RourceType !== this.rource_type.self
          ? cannot_del_data.push(i) // 不可删除数据
          : i.Type === this.type.folder 
            ? normal_data_folder.push(i.Id) // 可删除文件夹
            : normal_data_file.push(i.Id) // 可删除文件
      })
      // 不可删除数据进行提示
      if(cannot_del_data.length > 0){
        let _msg = '<p class="title">以下文件或文件夹不可删除，已自动过滤</p>';
        cannot_del_data.forEach(i => {
          _msg += `<p class="msg">${i.Name}</p>`
        })
        this.$message({
          dangerouslyUseHTMLString: true,
          showClose: true,
          message: _msg, 
          type: "warning",
          customClass: 'mulit-msg',
        });
      }
      if(normal_data_folder.length === 0 && normal_data_file.length === 0) return;
      // 可删除数据正常删除
      let _data = {
        FolderIds: normal_data_folder,
        FolderFileIds: normal_data_file,
      }
      delFileApi(_data).then(({data}) => {
        if(data.StatusCode === apiok){
          this.file_table_data = this.file_table_data.filter(i => ![...normal_data_file, ...normal_data_folder].includes(i.Id));
          this.$message({
            showClose: true,
            message: data.Message,
            type: "success"
          });
        }
      })
    },
    // 获取所有文件夹
    getAllFolders(){
      getAllFoldersApi().then(({data}) => {
        if(data.StatusCode === apiok){
          this.all_folder_list = data.Data || [];
          let _list = [...this.all_folder_list];
          let options = {
            id: this.explorer_prop.pathId,
            pid: this.explorer_prop.pathPid,
            children: 'Children',
          }
          this.tree_folder_list = arrayToTree(_list, options)
        }
      })
    },
    // 判断是否文件夹函数
    isFolderFn(row){
      return row.Type === this.type.folder;
    }
  },
  created() {
    this.closeOtherLayout = closeOtherLayout;
    this.getAllFolders();
    this.getFileList();    
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: absolute;
  top:0;
  left:0;
  padding: 25px;
  width: 100%;
  height: 100%;
  background: #f7f7f7;
  box-sizing: border-box;
}
</style>

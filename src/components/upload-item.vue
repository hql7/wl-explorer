<template>
  <div>
    <!-- 标题区 -->
    <h3 class="edit-header" v-if="title">{{ title }}</h3>
    <div class="upload-box" :class="{'no-padding-box': noPadding}">
      <!-- 自定义内容区 -->
      <slot></slot>
      <!-- 文件上传区 :disabled="disUpload"-->
      <el-upload
        class="upload-demo"
        ref="upload"
        drag
        multiple
        with-credentials
        :action="url"
        :limit="limit"
        :data="upOptions"
        :headers="headers"
        :file-list="fileList"
        :auto-upload="autoUpload"
        :before-upload="beforeUpload"
        :on-error="handleError"
        :on-exceed="handleExceed"
        :on-success="handleSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
      <!-- 所上传文件的模板下载区 -->
      <div class="down-template" v-if="templateCode" @click="downTemplate">
        <i class="iconfont icon-xiazai1"></i>
        <span>
          <slot name="templateMsg">点击下载模板</slot>
        </span>
      </div>
      <!--定制区 进度计划下载excel模板 -->
      <div
        v-if="schedulePlan"
        class="down-template"
        @click="downPlanExcelTemplate"
      >
        <i class="iconfont icon-xiazai1"></i>
        <span>点击下载进度计划Excel模板</span>
      </div>
      <!-- 预览区 -->
      <template v-if="view && view_files.length > 0">
        <!-- 可预览的已上传文件列表区 -->
        <el-scrollbar class="view-file-box" v-loading="loading">
          <h3>预览文件：</h3>
          <ul class="view-files">
            <li
              class="view-file-item"
              v-for="item of view_files"
              :key="item.Id"
              @click="viewFile(item.Id)"
            >
              <label class="el-icon-search"></label>
              <span>{{ item.Name }}</span>
            </li>
          </ul>
        </el-scrollbar>
        <!-- 文件预览区 -->
        <file-view
          v-show="view_show"
          class="file-view-components"
          ref="file-view"
          @close="view_show = false"
        ></file-view>
      </template>
    </div>
  </div>
</template>

<script>
/**
 * auth:weilan
 * github: https://github.com/hql7
 * props: 输入
 * title:组件标题
 * templateCode:[String, Array]下载模板所需编码,多个模板时array
 * url:上传地址
 * options:上传附带参数
 * autoUpload:自动上传
 * uploadSuccess:父组件监听函数
 * reg:是否校验excel
 * path:是否显示文件路径
 * contract: 获取文件上传路径所需参数
 * defaultProps：路径树配置参数
 * view: 开启将在上传区下显示可预览文件列表区
 * iscom: 是否通用上传，仅区分通用上传使用内部通用逻辑还是采用外部逻辑
 * schedule-plan: 是否进度计划模块
 * emit: 输出
 * uploadSuccess：上传成功回调
 * length: 已上传文件列表长度
 * solt: 插槽
 *  templateMsg：下载模板的显示信息
 * --------> path模式为通用文件上传路径，文件夹的增删改均在内部完成。
 * --------> 同普通上传一致只需传入接口所需参数，输出均为上传成功回调。
 * --------> 手动上传模式均需要在父组件调用子组件方法，在父组件引入此组件时，给此组件加ref，然后this.$refs.[""].toUpload()即可!
 * --------> 此组件请使用v-if展示。使用范例：claim-apply.vue。
 */
import { getSession } from "@/util/session";
import {
  downTemplteApi,
  download,
  getUplodPathApi,
  getUplodedListApi
} from "@/api/public";
import {
  addSortApi, // 提交保存分类
  delSortApi // 删除分类
} from "@/api/data-manage"; // 导入api
import { exportPlanApi } from "@/api/schedule-plan.js"; // 导入进度计划导出excel接口
import { lineFeed } from "@/util"; // 导入msg拆分
import fileView from "./file-view";

export default {
  data() {
    return {
      headers: {
        auth: getSession("buliderauth")
        // "Content-Type": "application/json;charset=UTF-8"
      },
      per_tree_err: "", // 记录路径名
      per_tree_item: {}, // 记录路径节点
      per_tree_id: "", // 记录路径id
      PowerCode: "", // 权限编码
      path_options: {
        auth: false,
        msg: ""
      },
      fileList: [], // 已上传文件
      path_tree: [], // 路径数据
      loading: false, // 已上传列表获取loading
      view_files: [], // 可预览文件列表
      filed_num: 0, // 已上传文件数量
      old_filed_num: 0, // 下次上传前已上传文件数量
      view_show: false, // 是否查看预览
      heavy_load: true // 用于重载
    };
  },
  props: {
    // 组件标题
    title: {
      type: String,
      default: "附件管理"
    },
    // 模板编码
    templateCode: [String, Array],
    // 上传地址
    url: {
      type: String,
      default: "/Api/Doc/File/UploadFile" // 通用上传地址
      // required: true
    },
    // 上传参数
    options: [Object, String],
    // 自动上传
    autoUpload: {
      type: Boolean,
      default: false
    },
    // 上传前校验
    reg: {
      type: Boolean,
      default: true
    },
    // 自定义校验函数
    regFuc: Function,
    // 是否显示路径
    path: {
      type: Boolean,
      default: false
    },
    // 是否通用上传
    iscom: {
      type: Boolean,
      default: true
    },
    // 路径所需合同-业务参数
    contract: Object,
    // 路径数据
    pathTree: {
      type: Array,
      default: () => []
    },
    // 默认配置
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: "Children",
          label: "Name"
        };
      }
    },
    // 是否显示可预览文件
    view: {
      type: Boolean,
      default: false
    },
    // 是否进度计划模块
    schedulePlan: {
      type: Boolean,
      default: false
    },
    // 上传个数限制
    limit: Number,
    // 外部盒子是否使用padding
    noPadding: {
      type: Boolean,
      default: false
    },
    // 是否清除已上传文件列表 如不清 请使用v-if
    clear: {
      type: Boolean,
      default: true
    }
  },
  created() {
    if (this.view) {
      this.getUplodedList();
    }
  },
  methods: {
    // 下载模板
    downTemplate() {
      downTemplteApi(this.templateCode).then(res => {
        download(res);
      });
    },
    // 手动上传
    toUpload() {
      this.$refs.upload.submit();
    },
    // 上传前验证
    beforeUpload(file) {
      this.$emit('beforeUpload', file);
      // 不校验
      if (!this.reg) return true;
      // 自定义校验
      if (this.regFuc) return this.regFuc(file);
      // 通用验证
      let isXLS = false;
      if(file.type){
        isXLS = [
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ].includes(file.type);
      }else{
        let _split_arr = file.name.split('.');
        isXLS = ['xlsx', 'xls'].includes(_split_arr[_split_arr.length -1])
      }

      if (!isXLS) {
        this.$message.error("只能上传Excel文件");
      }
      return isXLS;
    },
    // 上传成功回调
    handleSuccess(res, file,fileList) {
      if (res.StatusCode == _gc_.StatusCode.ok) {
        this.$message.success(res.Message);
      } else {
        this.$message({
          showClose: true,
          dangerouslyUseHTMLString: true,
          message: lineFeed(res.Message),
          type: "error"
        });
      }
      // 清除列表会导致后续请求回调不调用
      if(this.clear) this.clearUploadList();
      this.getUplodedList(res, file);
      this.$emit("uploadSuccess", res, file,fileList);
    },
    // 上传失败回调
    handleError(err) {
      this.$message.error("上传失败");
      // this.clearUploadList();
      this.$emit("err", err);
    },
    // 清空已上传列表
    clearUploadList() {
      this.$refs.upload.clearFiles();
    },
    /**
     * 获取文件列表
     * uoload_res: 成功回调的res
     * uoload_file: 成功回调的文件列表
     */
    getUplodedList(uoload_res, uoload_file) {
      if (!this.options || !this.options.BizId) return;
      this.loading = true;
      let data = {
        BizId: this.options.BizId,
        BizCode: this.options.BizCode
      };
      getUplodedListApi(data)
        .then(res => {
          this.loading = false;
          if (res.data.StatusCode == _gc_.StatusCode.ok) {
            this.view_files = res.data.Data || [];
            this.$emit("length", this.view_files);
            uoload_res && this.$emit("uploadSuccess", uoload_res, uoload_file);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 预览文件
    viewFile(Id) {
      this.view_show = true;
      this.$refs["file-view"].seeData(Id);
    },
    // 文件超出限制
    handleExceed(files) {
      this.$message.error("超出文件上传个数限制，最大上传个数为：1！");
    },
    // 定制 进度计划导出带相应数据的excel模板
    downPlanExcelTemplate() {
      exportPlanApi().then(res => {
        download(res);
      });
    }
  },
  computed: {
    // 上传参数
    upOptions() {
      return this.options;
    }
  },
  components: { fileView }
};
</script>

<style lang="scss">
.upload-box {
  padding: 20px;

  .el-upload,
  .el-upload-dragger {
    width: 100%;
  }

  /* .el-upload-list{
    display: none;
  } */

  .down-template {
    margin-top: 10px;
    padding: 8px 10px;
    background-color: #f2f2f2;
    color: #409eff;
    cursor: pointer;
    line-height: 26px;
    border-radius: 4px;
  }

  .u-msg {
    margin-bottom: 10px;
    color: #f56c6c;
    font-size: 12px;
  }

  .upload-sort {
    width: 100%;
    margin-bottom: 20px;
  }

  // 路径树
  .path-tree {
    margin-bottom: 20px;
    max-height: 300px;
    overflow-y: auto;
  }

  /*  .el-tree {
    min-width: 100%;
    display: inline-block !important;
  } */

  .el-tree > .el-tree-node {
    min-width: 100%;
    display: inline-block !important;
  }

  .view-file-box {
    margin-top: 15px;
    height: 300px;
  }

  .view-file-item {
    margin-top: 5px;
    padding: 4px 10px;
    line-height: 20px;
    background-color: #f7f7f7;
    color: #409eff;
    cursor: pointer;
    border-radius: 4px;
  }

  .file-view-components {
    position: fixed;
    top: 100px;
    left: 250px;
    right: 30px;
    bottom: 30px;
    // background: transparent;
  }
}

.no-padding-box{
  padding: 0;
}

.u-tree-icon {
  margin-left: 8px;
}

.h-tree-ipt {
  border: 1px solid #dcdfe6;
  padding: 6px 10px;
  width: 120px;
  border-radius: 4px;
}
</style>

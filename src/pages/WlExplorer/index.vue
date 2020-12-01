<template>
  <!-- 文件管理器 auth：weilan time：2019-10-25 github：https://github.com/hql7 -->
  <div class="wl-explorer" @contextmenu.prevent>
    <!-- 头部按钮区 -->
    <el-form
      class="wl-header-btn"
      :inline="true"
      :size="size"
      @submit.native.prevent
    >
      <el-form-item>
        <el-button type="primary" @click="handleFolder('add')"
          >新增文件夹</el-button
        >
        <el-button :disabled="disabledEditFolder" @click="handleFolder('edit')"
          >编辑文件夹</el-button
        >
        <submit-btn
          type="danger"
          :size="size"
          @btn="handleDel"
          :status="load.del"
          >删除</submit-btn
        >
        <el-button @click="showUpload">上传文件</el-button>
        <!-- solt自定义头部按钮区 -->
        <slot name="header-btn"></slot>
      </el-form-item>
      <el-form-item>
        <el-dropdown
          trigger="click"
          placement="bottom"
          @command="handleDropdown"
        >
          <el-button type="primary" plain>
            更多操作
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="wl-move">移动</el-dropdown-item>
            <el-dropdown-item command="wl-download">下载</el-dropdown-item>
            <!-- props自定义头部更多操作 -->
            <el-dropdown-item
              v-for="i of selfHeaderDropdown"
              :key="i.id"
              :icon="i.icon"
              :command="i.command"
              :divided="i.divided"
              :disabled="i.disabled"
              >{{ i.name }}</el-dropdown-item
            >
            <!-- solt自定义头部更多操作 -->
            <slot name="header-dropdown"></slot>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
      <el-form-item v-show="uploading.ing">
        <span>正在上传：</span>
        <span class="c-blue u-uploading-name">{{ uploading.name }}</span>
        <span class="c-blue">({{ uploading.percentage }}%)</span>
      </el-form-item>
      <el-form-item class="u-right">
        <i
          class="iconfont icon-wl-list file-show-type"
          v-show="layout.show_list"
          @click="layout.show_list = !layout.show_list"
        ></i>
        <i
          class="iconfont icon-wl-grid file-show-type"
          v-show="!layout.show_list"
          @click="layout.show_list = !layout.show_list"
        ></i>
      </el-form-item>
    </el-form>
    <!--文件路径操作区-->
    <el-form
      :inline="true"
      :size="size"
      :model="file"
      class="wl-header-file"
      @submit.native.prevent
    >
      <el-form-item class="file-path-box">
        <div
          class="file-path-text"
          :class="{ small: size == 'small' }"
          v-show="!layout.edit_path"
          @click="handleFilePath"
        >
          <img
            class="file-path-img"
            src="./images/folder@3x.png"
            alt="文件夹"
            title="文件夹"
          />
          {{ file.path }}
        </div>
        <el-autocomplete
          class="u-full"
          ref="file-path-ipt"
          placeholder="请输入文件路径"
          v-model="file.path"
          v-if="layout.edit_path"
          @keyup.enter.native="filePathChange"
          @select="filePathChange"
          :fetch-suggestions="pathQuerySearch"
        >
          <img
            slot="prefix"
            class="file-path-img"
            src="./images/folder@3x.png"
            alt="文件夹"
            title="文件夹"
          />
        </el-autocomplete>
      </el-form-item>
      <el-form-item class="file-search-box">
        <el-input
          v-model="file.key"
          placeholder="请输入关键字搜索"
          @keyup.enter.native="fileSearch()"
        >
          <el-button
            slot="append"
            icon="el-icon-search file-search"
            @click="fileSearch()"
          ></el-button>
        </el-input>
      </el-form-item>
      <el-form-item class="file-handle-box">
        <i
          class="iconfont icon-wl-left file-path-handle"
          :class="{ 'u-disabled': pathIsStart }"
          @click="pathBtn('prv')"
        ></i>
        <i
          class="iconfont icon-wl-right file-path-handle"
          :class="{ 'u-disabled': pathIsEnd }"
          @click="pathBtn('next')"
        ></i>
        <i
          class="iconfont icon-wl-up file-path-handle"
          :class="{ 'u-disabled': path.level === 1 }"
          @click="pathBtn('top')"
        ></i>
      </el-form-item>
    </el-form>
    <!-- 主内容区 -->
    <el-scrollbar class="wl-main-scroll">
      <!-- 文件列表区 -->
      <div class="wl-main-list">
        <!-- 表格型文件列表 -->
        <el-table
          v-show="layout.show_list"
          @selection-change="filrChecked"
          highlight-current-row
          :border="showBorder"
          :data="self_data"
          class="wl-table"
          ref="wl-table"
        >
          <el-table-column
            v-if="showCheckbox"
            align="center"
            type="selection"
            width="55"
          ></el-table-column>
          <el-table-column
            v-if="showIndex"
            align="center"
            type="index"
            label="序号"
            width="55"
          ></el-table-column>
          <slot name="table-column-top"></slot>
          <el-table-column
            v-for="i of selfColumns"
            show-overflow-tooltip
            :key="i._id"
            :prop="i.prop"
            :width="i.width"
            :label="i.label"
            :fixed="i.fixed"
            :align="i.align"
            :sort-by="i.sortBy"
            :sortable="i.sortable"
            :min-width="i.minWidth"
            :formatter="i.formatter"
            :column-key="i.columnKey"
            :class-name="i.className"
            :sort-method="i.sortMethod"
            :header-align="i.headerAlign"
            :render-header="i.renderHeader"
            :label-class-name="i.labelClassName"
          >
            <template slot-scope="scope">
              <!-- 非名称列 -->
              <template v-if="i.prop !== selfProps.name">
                {{
                  i.formatter
                    ? i.formatter(
                        scope.row,
                        scope.column,
                        scope.row[i.prop],
                        scope.$index
                      )
                    : scope.row[i.prop]
                }}
              </template>
              <!-- 名称列 -->
              <div
                v-else
                @click="enterTheLower(scope.row, scope.row[selfIsFolder])"
                class="wl-name-col wl-is-folder"
              >
                <!-- 不同文件类型图标区 -->
                <div class="namecol-iconbox">
                  <img
                    :src="fileTypeIcon(scope.row)"
                    class="name-col-icon"
                    alt="文件类型图标"
                  />
                </div>
                <!-- 不同文件类型 显示内容-->
                <div class="namecol-textbox">
                  {{
                    i.formatter
                      ? i.formatter(
                          scope.row,
                          scope.column,
                          scope.row[i.prop],
                          scope.$index
                        )
                      : scope.row[i.prop]
                  }}
                </div>
              </div>
            </template>
          </el-table-column>
          <slot name="table-column-bottom"></slot>
        </el-table>
        <!-- 列表型文件列表 -->
        <ul class="wl-list" v-show="!layout.show_list">
          <li
            class="wl-list-item wl-is-folder"
            v-for="(i, idx) in self_data"
            :key="i.Id"
          >
            <el-checkbox
              class="wl-checkbox"
              :class="{ 'wl-checkbox-checked': i._checked }"
              @change="listItemCheck($event, i)"
              v-model="i._checked"
            ></el-checkbox>
            <div @click="enterTheLower(i, i[selfIsFolder])">
              <img
                :src="fileTypeIcon(i)"
                class="name-col-icon"
                alt="文件类型图标"
              />
              <p class="list-item-name" :title="i[selfProps.name]">
                {{
                  i.formatter
                    ? i.formatter(i, null, i[selfProps.name], idx)
                    : i[selfProps.name]
                }}
              </p>
            </div>
          </li>
        </ul>
        <!-- 横排型文件列表 -->
        <slot name="main"></slot>
      </div>
    </el-scrollbar>
    <!-- slot 自定义dom区 -->
    <slot></slot>
    <!-- 文件预览区 -->
    <template v-if="usePreview">
      <file-view
        v-show="layout.view"
        ref="file-view"
        class="file-view-components"
        :previewType="previewType"
        :previewOptions="previewOptions"
        @close="layout.view = false"
      ></file-view>
    </template>
    <!-- 移动文件区 -->
    <el-dialog title="移动文件" width="520px" :visible.sync="layout.move">
      <wlTreeSelect
        class="u-full"
        :size="size"
        :data="tree_path"
        :props="selfMoveProps"
        :nodeKey="selfProps.pathId"
        v-model="move_selected"
      ></wlTreeSelect>
      <span slot="footer" class="dialog-footer">
        <el-button :size="size" @click="layout.move = false">取 消</el-button>
        <submit-btn :size="size" @btn="fileMove" :status="load.move"
          >确 定</submit-btn
        >
      </span>
    </el-dialog>
    <!-- 文件上传区 -->
    <template v-if="useUpload">
      <fade-in v-show="layout.upload">
        <h3 class="edit-header">上传文件</h3>
        <el-scrollbar class="scroll">
          <el-form
            :size="size"
            ref="template_form"
            label-position="top"
            class="template_form rule-form"
          >
            <el-form-item label="文件路径">
              <wlTreeSelect
                class="u-full"
                :size="size"
                :data="tree_path"
                :props="selfMoveProps"
                :nodeKey="selfProps.pathId"
                v-model="upload_selected"
                @change="uploadPathChange"
              ></wlTreeSelect>
            </el-form-item>
            <el-form-item label="导入文件">
              <uploadItem
                ref="upload-item"
                :size="size"
                :reg="uploadReg"
                :url="uploadUrl"
                :limit="uploadLimit"
                :regFuc="uploadRegFuc"
                :options="uploadOptions"
                :headers="uploadHeaders"
                @beforeUpload="uploadBefore"
                @uploadSuccess="uploadSuccess"
                @uploadError="uploadError"
              ></uploadItem>
            </el-form-item>
          </el-form>
        </el-scrollbar>
        <!-- 按钮区 -->
        <div class="submit-btn-box">
          <submit-btn :size="size" @btn="saveUpload()" :status="load.upload"
            >保存</submit-btn
          >
          <el-button :size="size" @click="layout.upload = false"
            >取消</el-button
          >
        </div>
      </fade-in>
    </template>
  </div>
</template>

<script>
import submitBtn from "@/components/submit-btn.vue"; // 导入防抖组件
import fileView from "@/components/file-view.vue"; // 导入预览组件
import fadeIn from "@/components/fade-in.vue"; // 引入滑入组件
import uploadItem from "@/components/upload-item"; // 导入导入组件
import { arrayToTree, splicParentsUntil, download } from "@/util"; // 导入组装树函数、拼接路径函数
const guid = "00000000-0000-0000-0000-000000000000";
export default {
  name: "wlExplorer",
  components: { submitBtn, fileView, fadeIn, uploadItem },
  data() {
    return {
      load: {
        del: false, // 删除
        move: false, // 移动
        upload: false, // 上传
      }, // loading状态
      uploading: {
        name: "JS从脱贫到脱发你好长啊",
        percentage: 0,
        ing: false,
      }, // 当前上传文件状态
      layout: {
        show_list: true, // 文件展示形式
        edit_path: false, // 是否编辑路径
        view: false, // 预览视图
        move: false, // 移动视图
        upload: false, // 上传视图
      }, // 视图管理
      file: {
        pid: "", // 父文件夹
        id: "", // 文件夹id
        path: "", // 文件路径
        key: "", // 关键字
      }, // 文件相关参数
      path: {
        level: 1, // 当前层级
        index: -1, // 在历史的第几步
        history: [
          {
            path: "", // 文件夹名字
            pid: "", // 路径
            id: "", // 文件夹id
            data: [], // 数据
          },
        ], // 历史路径
      }, // 记录路径历史
      self_data: [], // 当前数据
      file_checked_data: [], // 列表多选数据
      matched_path: false, // 路径输入框内是否有匹配到的数据
      tree_path: [], // 全部路径树数据
      move_selected: "", // 所选移动文件目标路径
      upload_selected: "", // 所选上传文件目标路径
      uoload_data: {
        pathId: null,
        parentPathId: null,
        isCurrentFolder: true,
      }, // 上传提交操作抛出的信息
    };
  },
  props: {
    /**
     * 头部更多操作自定义内容
     * 需要包含内容：
     * name: String 每条数据的名字
     * command: Function 每条数据的指令
     * disabled: Boolean 每条数据的禁用
     * divided: Boolean 每条数据的显示分割线
     * icon: String 每条数据的图标类名
     */
    headerDropdown: Array,
    // 是否显示复选框
    showCheckbox: {
      type: Boolean,
      default: true,
    },
    // 是否显示顺序号
    showIndex: {
      type: Boolean,
      default: true,
    },
    // 表格是否显示边框
    showBorder: {
      type: Boolean,
      default: true,
    },
    // 文件表格数据
    data: Array,
    // 文件表头数据【[参数：所有el-Table-column Attributes] (https://element.eleme.cn/#/zh-CN/component/table)】
    columns: Array,
    /**
     * 配置项
     * isFolder: Boolean
     * name: String 表示名称列的字段
     */
    props: Object,
    // 所有文件路径 用于文件地址输入框自动提示,如不传则使用历史记录
    allPath: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 校验是否文件夹函数，（row）参数为当前行数据，用于复杂类型，当isFolderFn优先使用计算结果，不存在时使用props配置内的isFolder字段
    isFolderFn: Function,
    // 是否锁定文件、文件夹函数,true则不可进行操作
    isLockFn: Function,
    // 是否使用自带上传组件
    useUpload: {
      type: Boolean,
      default: true,
    },
    // 上传文件地址
    uploadUrl: {
      type: String,
      default: "",
    },
    //  是否校验上传文件
    uploadReg: {
      type: Boolean,
      default: false,
    },
    // 上传文件前校验函数，应返回Boolean
    uploadRegFuc: Function,
    // 上传文件头参数
    uploadHeaders: Object,
    // 上传文件参数
    uploadOptions: Object,
    // 上传个数限制
    uploadLimit: Number,
    // 是否使用自带预览组件
    usePreview: {
      type: Boolean,
      default: true,
    },
    // 预览文件类型
    previewType: {
      type: String,
      default: "img",
    },
    // 预览文件地址或配置项
    previewOptions: Object,
    // 拼接路径配置项
    splicOptions: Object,
    size: {
      type: String,
      default: "medium",
    },
  },
  methods: {
    /**
     * 文件夹编辑操作
     * type: string 添加add 编辑edit
     * auth: boolean 是否只修改权限
     */
    handleFolder(type) {
      let [_act = null] = this.file_checked_data;
      if (type === "edit" && (!_act || !_act[this.selfIsFolder])) {
        this.$message({
          showClose: true,
          message: "请选择文件夹",
          type: "error",
        });
        return;
      }
      // 当前文件夹 文件夹操作类型 新增文件夹回调（只用于历史存储）
      this.$emit("handleFolder", _act, type, this.file);
      this.closeUpload();
    },
    // 文件夹删除操作
    handleDel() {
      if (this.file_checked_data.length === 0) {
        this.$message({
          showClose: true,
          message: "请选择要删除的文件或文件夹",
          type: "error",
        });
        return;
      }
      // 删除确认
      this.$confirm("是否确认删除选中数据？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$emit("del", this.file_checked_data);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 更多操作
    handleDropdown(val) {
      if (typeof val === "function") {
        val(this.file);
        return;
      }
      if (val === "wl-move") {
        this.showMoveList();
      } else if (val === "wl-download") {
        this.wlDownload();
      }
    },
    // 显示文件路径输入框
    handleFilePath() {
      this.layout.edit_path = true;
      this.$nextTick(() => {
        this.$refs["file-path-ipt"].focus();
      });
    },
    // 输入文件路径
    filePathChange(item) {
      if (!this.matched_path) {
        this.$confirm.alert(
          `文件管理器内找不到"${this.file.path}"。请检查拼写并重试。`,
          "文件资源管理器",
          {
            confirmButtonText: "确定",
            callback: () => {},
            closeOnClickModal: true,
            closeOnPressEscape: true,
            type: "error",
          }
        );
        return;
      }
      let _act_item = this.path.history.find(
        (i) => i.id === item[this.selfProps.pathId]
      );
      if (_act_item) {
        this.routerActive(_act_item, _act_item.data);
      } else {
        this.routerPush({
          id: item[this.selfProps.pathId],
          pid: item[this.selfProps.pathPid],
          path: item[this.selfProps.pathName],
        });
      }

      this.$emit("search", this.file, !_act_item);
      this.layout.edit_path = false;
    },
    // 搜索文件
    fileSearch() {
      if (this.file.key !== "") {
        this.$emit("search", this.file, true);
        return;
      }
      let _act_item = this.path.history.find((i) => i.id === this.file.id);
      _act_item
        ? this.routerActive(_act_item, _act_item.data)
        : this.$emit("search", this.file, true);
    },
    /**
     * 往历史里添加新的步骤
     * file: Object 路径数据{id: 路径id, pid: 父级路径id, path: 路径名}
     * data: Array 当前路径下的数据
     */
    routerPush(file, data = []) {
      splicParentsUntil(this.allPath, file, this.selfProps);
      this.clearSearchKey();
      this.path.history.push({
        ...file,
        data,
      });
      this.self_data = data;
      this.file.pid = file.pid;
      this.file.id = file.id;
      this.file.path = splicParentsUntil(this.allPath, file, this.selfProps);
      this.path.level = !file.id || file.id === guid ? 1 : 2;
      this.path.index = -1; // 将步骤从新回到原位
    },
    /**
     * 处理当前步骤数据
     * file: Object 路径数据{id: 路径id, pid: 父级路径id, path: 路径名}
     * data: Array 当前路径下的数据
     */
    routerActive(file, data) {
      this.clearSearchKey();
      this.file.pid = file.pid;
      this.file.id = file.id;
      this.file.path = splicParentsUntil(this.allPath, file, this.selfProps);
      this.self_data = data;
      this.path.level = !file.id || file.id === guid ? 1 : 2;
    },
    /**
     * 手动更新历史记录的数据
     * id 路径id
     * data 所有更新的此路径下的完整数据
     */
    updateHistoryData(id, data) {
      let _target = this.path.history.find((i) => i.id === id);
      if (!_target) return;
      _target.data = data;
    },
    // 显示可移动目录
    showMoveList() {
      if (this.file_checked_data.length === 0) {
        this.$message({
          showClose: true,
          message: "请选择要移动的文件或文件夹",
          type: "error",
        });
        return;
      }
      this.layout.move = true;
    },
    // 显示下载
    wlDownload() {
      if (this.file_checked_data.length === 0) {
        this.$message({
          showClose: true,
          message: "请选择要下载的文件或文件夹",
          type: "error",
        });
        return;
      }
      this.$emit("download", this.file_checked_data, download);
    },
    // 前进后退按钮操作
    pathBtn(type) {
      if (type === "prv") {
        if (this.pathIsStart) return;
        if (this.path.index === -1) {
          this.path.index = this.path.history.length - 1;
        }
        this.path.index -= 1;
        let _prv = this.path.history[this.path.index];
        this.routerActive(_prv, _prv.data);
      } else if (type === "next") {
        if (this.pathIsEnd) return;
        this.path.index += 1;
        let _next = this.path.history[this.path.index];
        this.routerActive(_next, _next.data);
      } else {
        if (this.path.level === 1) return;
        let _pid = this.file.pid !== guid ? this.file.pid : "";
        let _parent_history = this.path.history.find((i) => i.id === _pid);
        if (_parent_history) {
          this.path.history.splice(
            this.path.history.findIndex((i) => i.id === _pid),
            1
          );
          this.routerPush(_parent_history, _parent_history.data);
          return;
        }
        // 历史记录没有时 从全部路径里找
        let _parent = this.selfPathHistory.find((i) => i.id === _pid);
        if (!_parent) return;
        this.routerPush({
          id: _parent[this.selfProps.pathId],
          pid: _parent[this.selfProps.pathPid],
          path: _parent[this.selfProps.pathName],
        });

        this.$emit("search", this.file, true);
      }
    },
    /**
     * 文件夹时进入下一级-文件时预览文件
     * row: Object 行数据
     * isFolder: Boolean 行是否文件夹
     */
    enterTheLower(row, isFolder) {
      if (!isFolder) {
        this.previewFile(row);
        return;
      }
      let _children = this.path.history.find(
        (i) => i.id === row[this.selfProps.pathId]
      );
      if (_children) {
        // 历史找到子集时
        this.path.history.splice(
          this.path.history.findIndex(
            (i) => i.id === row[this.selfProps.pathId]
          ),
          1
        );
        this.routerPush(_children, _children.data);
        return;
      }
      // 历史找不到子集时 请求更新
      this.routerPush({
        id: row[this.selfProps.pathId],
        pid: row[this.selfProps.pathPid],
        path: row[this.selfProps.pathName],
      });
      this.$emit("search", this.file, true);
    },
    // 文件、文件夹移动
    fileMove() {
      this.$emit(
        "move",
        this.move_selected[0],
        this.file_checked_data,
        this.load.move
      );
      this.$nextTick(() => {
        this.layout.move = false;
      });
    },
    // 显示上传界面
    showUpload() {
      this.upload_selected = this.file.id;
      this.uoload_data = {
        parentPathId: this.file.pid,
        pathId: this.file.id,
        isCurrentFolder: true,
      };
      if (this.useUpload) {
        this.layout.upload = true;
        this.$emit("closeFade");
      } else {
        this.$emit("showUpload");
      }
    },
    // 关闭上传界面
    closeUpload() {
      this.layout.upload = false;
    },
    // 文件上传路径修改
    uploadPathChange([val]) {
      const pathId = val[this.selfProps.pathId];
      this.uoload_data = {
        parentPathId: val[this.selfProps.pathPid],
        pathId,
        isCurrentFolder: pathId == this.file.id,
      };
    },
    // 文件上传提交操作
    saveUpload() {
      this.$emit("upload", this.uoload_data, this.handleUpload);
    },
    // 手动上传文件
    handleUpload() {
      this.$refs["upload-item"].toUpload();
    },
    // 文件上传成功回调
    uploadSuccess(res) {
      this.$emit("uploadSuccess", res);
      this.closeUpload();
      if (!res.Data) return;
      let _res_data = res.Data || {};
      if (this.isFolderFn) {
        _res_data.isFolder = this.isFolderFn(_res_data);
      }
      if (this.isLockFn) {
        _res_data.isLock = this.isLockFn(_res_data);
      }
      if (this.explorer_upload_data.bizId === this.file.id) {
        this.self_data.push(_res_data); // 当前文件夹上传 当即展示 因对象引用 历史记录也会自动更改
        return;
      }
      // 非当前 如在历史记录里已有所选路径 则更新历史记录内的数据
      let _act = this.path.history.find(
        (i) => i.id === this.explorer_upload_data.bizId
      );
      if (!_act) return;
      _act.data.push(_res_data);
    },
    // 文件上传前回调
    uploadBefore(file) {
      this.$emit("uploadBefore", file, this.file);
    },
    // 文件上传失败回调
    uploadError(err) {
      this.$emit("uploadError", err);
      this.load.upload = false;
    },
    // 地址输入框匹配
    pathQuerySearch(queryString, cb) {
      let restaurants = this.selfPathHistory;
      let results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      this.matched_path = results.length > 0;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    // 根据文件类型显示图标
    fileTypeIcon(row) {
      let _path = "";
      // 文件夹
      if (row[this.selfIsFolder]) {
        _path = row[this.selfIsLock]
          ? require("./images/file_automatic@3x.png")
          : require("./images/folder@3x.png");
        return _path;
      }
      // 其他根据后缀类型
      let _suffix = row[this.selfProps.suffix];
      if (!_suffix) {
        _path = require("./images/file_none@3x.png");
        return _path;
      }
      if (["jpg", "jpeg", "png", "gif", "bmp"].includes(_suffix)) {
        // 图片
        _path = require("./images/file_img@3x.png");
      } else if (["zip", "rar", "7z"].includes(_suffix)) {
        _path = require("./images/file_zip@3x.png");
      } else if (
        ["avi", "mp4", "rmvb", "flv", "mov", "m2v", "mkv"].includes(_suffix)
      ) {
        _path = require("./images/file_video@3x.png");
      } else if (["mp3", "wav", "wmv", "wma"].includes(_suffix)) {
        _path = require("./images/file_mp3@3x.png");
      } else if (["xls", "xlsx"].includes(_suffix)) {
        _path = require("./images/file_excel@3x.png");
      } else if (["doc", "docx"].includes(_suffix)) {
        _path = require("./images/file_docx@3x.png");
      } else if ("pdf" == _suffix) {
        _path = require("./images/file_pdf@3x.png");
      } else if ("ppt" == _suffix) {
        _path = require("./images/file_ppt@3x.png");
      } else if ("txt" == _suffix) {
        _path = require("./images/file_txt@3x.png");
      } else {
        _path = require("./images/file_none@3x.png");
      }
      return _path;
    },
    // 记录多选列表数据
    filrChecked(val) {
      this.self_data.forEach((i) => (i._checked = false));
      val.forEach((i) => (i._checked = true));
      this.file_checked_data = val;
    },
    // 列表模式记录多选数据
    listItemCheck(check, val) {
      this.$refs["wl-table"].toggleRowSelection(val);
    },
    // 清空关键词
    clearSearchKey() {
      this.file.key = "";
    },
    // 预览文件
    previewFile(row) {
      this.$emit("preview", row, this.showPreview);
    },
    // 打开预览组件
    showPreview() {
      this.layout.view = true;
    },
    // 处理数据变动
    handleDataChange(val) {
      let _data = val || [];
      if (this.isFolderFn) {
        _data.forEach((i) => {
          i.isFolder = this.isFolderFn(i);
        });
      }
      if (this.isLockFn) {
        _data.forEach((i) => {
          i.isLock = this.isLockFn(i);
        });
      }
      if (this.file.key) {
        this.self_data = _data;
        return;
      }
      let _act = this.path.history.find((i) => i.id === this.file.id);
      if (!_act) return;
      _act.data = _data;
      this.routerActive(_act, _data);
    },
  },
  computed: {
    // 自身头部更多操作自定义内容
    selfHeaderDropdown() {
      let _data = this.headerDropdown || [];
      _data.forEach((i, idex) => {
        i.id = i.id || `h-drop-id-${idex}`;
      });
      return _data;
    },
    // 自身表头数据
    selfColumns() {
      let _data = this.columns || [];
      _data.forEach((i, idx) => {
        i._id = `_col_${idx}`;
      });
      return _data;
    },
    // 自身配置项
    selfProps() {
      return {
        isFolder: "isFolder", // Boolean 用于有布尔值字段表示数据是否文件夹类型的情况,当使用isFolderFn函数时，此参数会被忽略
        isLock: "isLock", // Boolean 用于有布尔值字段表示数据是否锁定文件类型的情况,当使用isLockFn函数时，此参数被忽略
        name: "name", // String 用于显示名称列的字段
        suffix: "suffix", // String 用于判断后缀或显示文件类型列的字段
        match: "name", // String 用于设定输入框自动补全的匹配字段
        splic: true, // Boolean 用于设定输入框自动补全的匹配字段是否需要将match字段和祖先节点拼接
        pathName: "name", // String 路径数据 显示名称字段
        pathId: "id", // String 路径数据 id字段
        pathPid: "pid", // String 路径数据 pid字段
        pathChildren: "children", // String 路径数据 children字段
        pathDisabled: "disabled", // String 路径数据 禁用字段
        pathConnector: "\\", // String 路径父子数据拼接连接符,默认为'\'
        pathParents: "parents", // String 路径数据所有直系祖先节点自增长identityId逗号拼接
        pathIdentityId: "identityId", // String 路径数据自增长id
        ...this.props,
      };
    },
    // 自身移动 下拉框树 配置项
    selfMoveProps() {
      return {
        label: this.selfProps.pathName,
        children: this.selfProps.pathChildren,
        disabled: this.selfProps.pathDisabled,
      };
    },
    // 将是否文件夹的两种判断方式合并返回
    selfIsFolder() {
      return this.isFolderFn ? "isFolder" : this.selfProps.isFolder;
    },
    // 将是否锁定文件、文件夹的两种判断方式合并返回
    selfIsLock() {
      return this.isLockFn ? "isLock" : this.selfProps.isLock;
    },
    // 当前是否最后一步
    pathIsEnd() {
      return (
        this.path.history[this.path.history.length - 1].id === this.file.id
      );
    },
    // 当前是否最后一步
    pathIsStart() {
      return this.path.history[0].id === this.file.id;
    },
    // 自身文件路径输入框提示列表
    selfPathHistory() {
      let _all_path = this.allPath || [];
      if (this.selfProps.splic) {
        this.allPath.forEach((i) => {
          i.id = i[this.selfProps.pathId];
          i.value = splicParentsUntil(_all_path, i, this.selfProps);
        });
      } else {
        this.allPath.forEach((i) => {
          i.value = i[this.selfProps.match];
        });
      }
      return this.allPath || this.path.history || [];
    },
    // 是否禁用编辑文件夹按钮
    disabledEditFolder() {
      return (
        this.file_checked_data.length !== 1 ||
        !this.file_checked_data[0][this.selfIsFolder]
      );
    },
  },
  watch: {
    // 检测data数据更新列表
    data(val) {
      this.handleDataChange(val);
    },
    // 检测所有路径，组成树
    allPath(val) {
      let options = {
        id: this.selfProps.pathId,
        pid: this.selfProps.pathPid,
        children: this.selfProps.pathChildren,
      };
      this.tree_path = arrayToTree(val || [], options);
    },
  },
  created() {
    if (this.data && this.data.length > 0) {
      this.handleDataChange(this.data);
    }
  },
};
</script>

<style lang="scss">
@import "./css/index.css";
@import "./css/clear.css";
@import "./icons/iconfont.css";
</style>
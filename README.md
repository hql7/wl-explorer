# wl-explorer

## 简介

用于vue框架的文件管理器插件，云盘。File manager plug-in for vue framework, cloud disk.  

一个基于Vue和ElementUi的文件管理器插件，提供类似某云盘操作台的功能。

此组件较为复杂，并且有些设定可能太贴合原来的项目。初次使用建议clone项目做对照，另有q群回复比较及时：1058847321

### 提供的功能
1. 文件夹的编辑，新增，移动，删除，下载

2. 文件上传、下载、预览，移动

3. 类似windows文件管理器的文件夹路径搜索，历史记录快捷键

4. 表格模式、图标模式切换等

## [在线访问](http://wlui.com.cn/ui/explorer) 

### 启动
```
1. 克隆示例项目
git clone git@github.com:hql7/wl-explorer.git

2. 下载依赖并运行示例项目
npm install
npm run serve

3. 在你的项目上引入wl-explorer
npm i wl-explorer -S
// main.js中
import wlExplorer from "wl-explorer";`
import "wl-explorer/lib/wl-explorer.css"
Vue.use(wlExplorer);

4. 运行你的项目，并对照git@github.com:hql7/wl-explorer.git项目示例
``` 
> 另一个选择
```
1. 克隆集成了wl-explorer组件的wl-admin后台管理系统模板项目
git clone git@github.com:hql7/wl-admin.git

2. 下载依赖并运行示例项目
npm install
npm run serve

3. 在src/views/ui/explorer文件夹下查看mock数据方案的npm install wlExplorer 示例
```

## 快速上手
`npm i wl-explorer -S`

``` jsvascript
import wlExplorer from "wl-explorer";`
import "wl-explorer/lib/wl-explorer.css"
Vue.use(wlExplorer);
```
``` template
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
```
``` jsvascript
  内容较多，如下
```
见github [app.vue](https://github.com/hql7/wl-explorer/blob/master/src/App.vue)


<!-- ## 演示效果
  ![image](./src/assets/explorer-demo.gif)
 -->
## 文档
###  Attributes
| 序号 | 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| 1 | headerDropdown | 头部更多操作自定义菜单,item必须包括字段：name:String菜单名，command:Fn此菜单指令，可选字段disabled:Boolean是否禁用，divided:Boolean是否显示分割线，icon:String图标 | Array | - | 
| 2 | showCheckbox | 是否显示复选框列 | Boolean | true |
| 3 | showIndex | 是否显示序号列 | Boolean | true |
| 4 | showBorder | 表格是否显示边框 | Boolean | true |
| 5 | data | 列表数据【当前只支持一维数据，每次传入当前文件夹数据，但是组件内会记录并更新已经得到数据的文件夹历史，并不过度依赖请求】| Array | - |
| 6 | columns | 文件列表表头数据 | Array | [所有el-table提供的Table-column Attributes](https://element.eleme.cn/#/zh-CN/component/table) |
| 7 | props | 配置项 | Object | 详见下方props |
| 8 | allPath | 所有文件路径列表,用于快速访问、移动、上传、新建时 | Array | - |
| 9 | isFolderFn | 判断是否文件夹函数function(row)参数是当前行数据，函数应返回Boolean值 | Function | - |
| 10 | isLockFn | 判断是否锁定文件夹函数function(row)参数是当前行数据，函数应返回Boolean值 | Function | - |
| 11 | useUpload | 是否使用自带上传组件【如需要自定义上传组件，在组件内部写dom即可。不具名solt】 | Boolean | true |
| 12 | uploadUrl | 上传文件地址 | String | - |
| 13 | uploadReg | 是否校验上传文件，开启则需要使用uploadRegFuc函数 | Boolean | false |
| 14 | uploadHeaders | 上传头信息 | Object | - |
| 15 | uploadOptions | 上传参数 | Object | - |
| 16 | uploadLimit | 最大上传个数 | Number | - |
| 17 | usePreview | 是否使用自带预览组件【如需要自定义预览组件，在组件内部写dom即可。不具名solt】| Boolean | true | 
| 18 | previewType | 预览文件类型，'img','video','audio','iframe'(包括txt、html、pdf) | String | img |
| 19 | previewOptions | 文件预览地址或配置项，除video外只需`{String}文件链接地址`即可，video时见video.js配置项{sources: [{type: "video/mp4",src: ''}]} | Object/String | - |
| 20 | splicOptions | 废弃，合并入props拼接路径配置项，{Splic: 要拼接的字段, Connector: '\\', // 连接符； Id: "Id", // 数据源匹配字段；Parents: "Parents", // 所有父节点自增id以上到下排列逗号分隔；IdentityId: "IdentityId", // 当前自增id} | Object | `{ Splic: 'Name', Connector: '\\',  Id: "Id",  Parents: "Parents", IdentityId: "IdentityId", }` |

### props
| 序号 | 参数 | 说明 | 默认字段 | 字段值类型 |
| ---- | ---- | ---- | ---- | ---- |
| 1 | isFolder | 用于有布尔值字段表示数据是否文件夹类型的情况,当使用isFolderFn函数时，此参数会被忽略 | isFolder | Boolean |
| 2 | isLock | 用于有布尔值字段表示数据是否锁定文件类型的情况,当使用isLockFn函数时，此参数被忽略 | isLock | Boolean |
| 3 | name | 用于显示名称列的字段 | name | String |
| 4 | suffix | 用于判断后缀或显示文件类型列的字段 | suffix | String| 
| 5 | match | 用于设定文件路径输入框自动补全的匹配字段,如下面`splic`字段值为false时使用 | name | String |
| 6 |  splic | 【特殊字段】配置项中只有此参数为字段值，其他均为字段key，即props里必有一个splic参数表示是否需要将路径名拼接为`父路径\父路径\当前路径`的形式 | Boolean | true |
| 7 | pathName | 路径数据中表示名称的字段 | name | String |
| 8 | pathId | 路径数据中表示id字段 | id | String |
| 9 | pathPid | 路径数据中表示parentId的字段 | pid | String | 
| 10 | pathChildren | 路径数据中表示children字段 | children | String |
| 11 | pathDisabled | 路径数据中表示禁用字段 | disabled | String | 
| 12 | pathConnector | 路径父子数据拼接连接符,默认为'\' | '\\' | String |
| 13 | pathParents | 路径数据所有直系祖先节点自增长identityId逗号拼接 | parents | String |
| 14 | pathIdentityId | 路径数据自增长id | identityId | String |
| 15 | size | 设置内部组件大小，同elementui | medium | String |


### Events

| 序号 | 事件名称 | 说明 | 回调参数 |
| ---- | ---- | ---- | ---- |
| 1 | handleFolder | 文件夹新增或编辑 | function(act,type,file)依次为当前选择文件夹、类型`edit`,`add`、当前的路径信息 | 
| 2 | del | 删除 | function(data)依次为要删除的数据 | 
| 3 | search | 获取数据 | function(path, true)依次为当前路径对象、是否需要更新数据（不需要表示存在历史数据） |
| 4 | download | 下载文件或文件夹 | function(data, cb)依次为选中数据，请求成功后的下载回调函数，使用时将接口设为blob格式，将带请求头的返回值放进cb(res)即可 |
| 5 | move | 移动 | function(to, data, load)依次为移动的目标，要移动的数据，防抖变量。在时间的最上部设置load为true可以防抖+loading效果，请求结束需要手动设置为fasle | 
| 6 | closeFade | 关闭其他弹出框 | 为防止弹出框覆盖，应在接收到此函数时关闭外部页面上其他遮罩性的dom | 
| 7 | showUpload | 打开上传界面 | 不使用自带上传时调用 |
| 8 | uploadBefore | 上传前回调 | function(file, path)依次为上传文件，当前路径对象。可此函数里调整上传接口参数 |
| 9 | upload | 上传事件 | function(data, cb)依次为当前路径对象，必须执行的上传回调，最迟应在此函数调整上传参数，后调用cb()上传 |
| 10 | uploadSuccess | 上传成功回调 | function(res)依次为接口返回数据，当接口返回列表行实体时，会自动处理逻辑并更新当前数据及历史数据【建议】，当成共不反回数据时，应请求接口更新数据，但是如上传路径非当前路径则历史数据需要手动调用方法更新 | 
| 11 | uploadError | 上传失败回调 | function(err)依次为错误信息 |
| 12 | preview | 预览事件 | function(data, cb)依次为当前选中预览的数据、打开预览组件的回调，应在此处更新预览参数后调用cb()打开预览 |

### Form Methods
| 方法名 | 说明 | 参数 |
| ---- | ---- | ---- |
| updateHistoryData | 更新历史数据，插件有历史时优先使用历史数据，因此非当前路径已经记录历史数据的且数据发生变动时，需手动调用添加 | function(item, val, update) 依次为：发生数据变动的路径信息`Object`（至少存在你`参数7 props里的pathId字段`用于在历史里匹配）；变动后的列表数据`Array`（主要用于新增文件夹或自定义上传时选择了非当前路径时的手动更新，【删除会自动处理】）；是否覆盖性更新`Boolean`（默认为false，当时false时执行数组合并，true时为完整数据覆盖）|

### Slot
| 序号 | name | 说明 |
| ---- | ---- | ---- |
| 1 | header-btn | 头部自定义操作按钮，位置在更多操作按钮前 | 
| 2 | header-dropdown | 头部更多操作slot，建议使用`参数1`的形式 |
| 3 | table-column-top | 自定义列，位置在`参数6`前,建议使用`参数6`的形式，可以formatter自定义dom |
| 4 | table-column-bottom | 自定义列，位置在`参数6`后,建议使用`参数6`的形式，可以formatter自定义dom |
| 5 | main | 在路径操作栏下的列表区 |
| 6 | - | 不具名slot，可以写任何dom模块 |

## 版本记录

> 0.2.0 修复平铺模式checkbox选中仍隐藏问题

> 0.1.8 修复上传文件的路径问题

> 0.1.7 修复文件路径拼接逻辑未采用splicOptions参数的错误，并将splicOptions废弃，合并入props，所有带path前缀的字段

> 0.1.6 修改debounce为throttle

> 0.1.5 增加size参数管理组件内小组件大小

> 0.1.4 修复图标模式，名称字段未使用props配置的错误

> 0.1.2 修复部分未按照props设置而写死字段的代码；修复updateHistoryData手动更新历史记录函数缺失问题

> 0.1.1 优化内置预览组件参数缺省时的错误；文档增加`方法`的说明；优化主slot在列表区的错误，并在列表区增加name为`main`的slot；

> 0.1.0 wl-explorer第一个版本发布

> 0.0.1 初次发布，部分功能未解耦，待续

<!-- 
  <video src="src/assets/explorer-demo.mp4" controls="controls" width="500" height="300">您的浏览器不支持播放该视频！</video> -->

## 待续
1.  优化预览组件


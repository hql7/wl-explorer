import Vue from 'vue'
import { Button, Form, FormItem, Dropdown, DropdownMenu, DropdownItem, Autocomplete, Input, Table, TableColumn, Checkbox, Dialog, Upload, Message, MessageBox, Loading, Scrollbar, Popover, Tree } from 'element-ui'

Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Autocomplete)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Checkbox)
Vue.use(Dialog)
Vue.use(Popover)
Vue.use(Tree)
Vue.use(Upload)
Vue.use(Scrollbar)
Vue.use(Loading.directive)

Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$loading = Loading.service;
Vue.prototype.$confirm = MessageBox.confirm;
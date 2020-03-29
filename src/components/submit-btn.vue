<template>
  <el-button
    :size="size"
    :type="type"
    :plain="plain"
    v-if="status"
    icon="el-icon-loading"
  ></el-button>
  <el-button :size="size" :type="type" :plain="plain" v-else @click="submit()"
    ><slot>保存</slot></el-button
  >
</template>

<script>
/**
 * 防抖表单提交按钮组件
 * props:
 * status -> 提交状态
 * type -> 按钮类型
 * emit:
 * btn -> 提交操作
 */
import { debounce } from "@/util"; // 导入防抖函数
export default {
  props: {
    // 状态
    status: {
      type: Boolean,
      default: false
    },
    // 类型
    type: {
      type: String,
      default: "primary"
    },
    // 是否简单样式
    plain: {
      type: Boolean,
      default: false
    },
    // 大小
    size:{
      type: String,
      default: "medium"
    }
  },
  methods: {
    // 节流输出
    submit: debounce(function() {
      this.$emit("btn");
    }, 2000, true)
  }
};
</script>

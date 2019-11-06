<template>
  <transition name="slide-fade">
    <div
      class="box fade-in-box"
      :class="{ 'fixed-box': fixed }"
      :style="{ width: width }"
    >
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    width: {
      type: String
    },
    fixed: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss">
/* 弹出区 */

.fade-in-box {
  position: absolute;
  top: 2px;
  right: 2px;
  bottom: 2px;
  z-index: 7;
  width: 325px;
  background-color: #fff;
  box-shadow: -1px 1px 4px rgba(120, 120, 120, 0.4);

  .edit-header {
    border-bottom: 1px solid #e9e9e9;
    padding: 0 20px;
    line-height: 52px;
    font-size: 16px;
    font-weight: 700;
    color: #333;
  }

  .rule-form {
    padding: 10px 20px 0;
    height: calc(100% - 142px);
    overflow-y: auto;
  }

  .rule-form-nopadding {
    height: calc(100% - 142px);
    overflow-y: auto;
  }

  > .scroll {
    height: calc(100% - 142px);

    > .el-scrollbar__wrap {
      overflow-x: hidden;
    }

    > .rule-form {
      padding: 10px 20px 0;
    }
  }

  .submit-btn-box {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 9;
    padding: 20px;
    width: 325px;
    box-sizing: border-box;
    background-color: #fff;
  }

  .el-ipt {
    width: 100%;
    margin-bottom: 10px;
  }

  .el-form-item__label {
    position: relative;
  }

  .el-form-item__label:before {
    position: absolute;
    right: -15px;
  }

  .el-form-item__label {
    padding: 0;
  }

  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}

.fixed-box {
  position: fixed;
  position: -ms-page;
  top: 90px;
  bottom: 20px;
  z-index: 7;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>

<template>
  <!-- 单独的pdf预览 相对于视窗 -->
  <div class="m-pdf-box">
    <h3 class="video-player-h3">
      <i
        class="el-icon-circle-close video-player-icon"
        @click="closePdf('close')"
      ></i>
    </h3>
    <iframe :src="embedPdfUrl" class="pdf-box">
      <!-- 您的浏览器不支持预览pdf文件，请下载并查看 <a href="/index.pdf">Download PDF</a> -->
    </iframe>
  </div>
</template>

<script>
export default {
  name: "pdf-online-emded",
  props: {
    pdfurl: String
  },
  mounted() {
    // 绑定键盘事件
    window.addEventListener("keyup", this.closePdf, false);
  },
  methods: {
    // 当pdf打开时按下esc关闭PDF
    closePdf(e) {
      if (e == "close") {
        this.$emit("closePDF");
        return;
      }
      if (e.keyCode === 27) {
        this.$emit("closePDF");
      }
    }
  },
  computed: {
    embedPdfUrl() {
      return this.pdfurl;
    }
  },
  beforeDestroy() {
    // 卸载键盘事件
    window.removeEventListener("keyup", this.closePdf, false);
  }
};
</script>

<style lang="scss">
.m-pdf-box {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  /*  width: 80%;
  height: 85%; */
  width: 100%;
  height: 100%;
  border: none;

  .pdf-box {
    width: 100%;
    height: calc(100% - 30px);
    border: none;
    background-color: #fff;
  }

  .video-player-h3 {
    // position: relative;
    // z-index: 9;
    padding: 0 10px;
    height: 30px;
    text-align: right;
    background-color: #909399;

    > .video-player-icon {
      line-height: 30px;
      font-size: 20px;
      color: #fff;
      cursor: pointer;
    }
  }
}
</style>

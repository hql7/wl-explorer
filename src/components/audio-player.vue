<template>
  <div class="audio-player-box">
    <h3 class="audio-player-h3"><i class="el-icon-circle-close audio-player-icon" @click="audioClose('close')"></i></h3>
    <audio class="u-audio" :src="audioUrl" autoplay controls>
      您的浏览器版本过低，暂不支持音频播放，请升级或更换浏览器。
    </audio>
  </div>
</template>

<script>
/*
 * 音频播放器组件
 * auth:weilan
 * time:2018-10-17
 */
export default {
  props: {
    url: String
    // options: Object
  },
  mounted() {
    // 绑定键盘事件
    window.addEventListener("keyup", this.audioClose, false);
  },
  methods: {
    audioClose(e) {
      if (e == "close") {
        this.$emit("closeAudio");
        return;
      }

      if (e.keyCode === 27) {
        this.$emit("closeAudio");
      }
    }
  },
  computed: {
    audioUrl() {
      return this.url;
    }
  },
  beforeDestroy() {
    // 卸载键盘事件
    window.removeEventListener("keyup", this.audioClose, false);
  }
};
</script>

<style lang="scss">
.audio-player-box {
  position: absolute;
  top: 30%;
  left: 20%;
  z-index: 99;
  width: 60%;
  padding: 0 40px 40px;
  box-sizing: border-box;
  border-radius: 4px;
  background-color: #edd3d3;

  > .audio-player-h3 {
    position: relative;
    height: 40px;
    text-align: right;

    > .audio-player-icon {
      position: absolute;
      right: -40px;
      top: 0;
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 20px;
      // color: #c6c6c6;
      cursor: pointer;
    }
  }

  > .u-audio {
    width: 100%;
  }
}
</style>

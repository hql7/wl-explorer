<template>
  <div class="video-player-box">
    <h3 class="video-player-h3"><i class="el-icon-circle-close video-player-icon" @click="videoClose"></i></h3>
    <!-- <div class="player"> -->
    <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions" @play="onPlayerPlay($event)" @pause="onPlayerPause($event)">
    </video-player>
    <!-- </div> -->
  </div>
</template>

<script>
/*
 * 视频播放器组件
 * auth:weilan
 * time:2018-10-16
 */
require("video.js/dist/video-js.css");
require("vue-video-player/src/custom-theme.css");
import { videoPlayer } from "vue-video-player";

export default {
  data() {
    return {
      selfOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: true, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4",
            src: "" //你的视频地址（必填）
          }
        ],
        poster: "", //你的封面地址
        width: document.documentElement.clientWidth,
        notSupportedMessage: "此视频暂无法播放，请稍后再试" //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        //        controlBar: {
        //          timeDivider: true,
        //          durationDisplay: true,
        //          remainingTimeDisplay: false,
        //          fullscreenToggle: true  //全屏按钮
        //        }
      }
    };
  },
  props: {
    options: Object
  },
  methods: {
    videoClose() {
      this.$emit("closeVideo");
    }
  },
  computed: {
    playerOptions() {
      return { ...this.selfOptions, ...this.options };
    },
    player() {
      return this.$refs.videoPlayer.player;
    }
  },
  components: { videoPlayer }
};
</script>

<style lang="scss">
.video-player-box {
  position: absolute;
  top: 10%;
  left: 10%;
  z-index: 99;
  width: 80%;
  // height: 80%;
  background-color: #efefef;
  /*  > .player {
    position: relative;
  } */
  > .video-player-h3 {
    position: relative;
    z-index: 9;
    margin-bottom: -10px;
    padding: 10px 15px 0;
    height: 26px;
    text-align: right;
    background-color: #000;

    > .video-player-icon {
      color: #fff;
      font-size: 20px;
      cursor: pointer;
    }
  }
}
</style>

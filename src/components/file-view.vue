<template>
  <div class="file-view" v-loading="loading">
    <!-- 视频播放器组件 -->
    <videoPlayer class="player-item" v-if="selfType == 'video'" :options="selfOptions" @closeVideo="closePreview"></videoPlayer>
    <!-- 音频播放器 -->
    <audio-player class="player-item" v-else-if="selfType == 'audio'" :url="selfOptions" @closeAudio="closePreview"></audio-player>
    <!-- pdf预览组件 -->
    <pdf-online class="player-item" v-else-if="selfType == 'iframe'" :pdfurl="selfOptions" @closePDF="closePreview"></pdf-online>
    <!-- 图片预览 -->
    <img-online  class="player-item" v-else-if="selfType == 'img'" :url="selfOptions" @closeImg="closePreview"></img-online>
  </div>
</template>

<script>
/**
 * 通用模块 预览聚合组件
 * props：无 所需参数在父组件调用本组件方法时通过方法参数传入
 * 输出：浏览关闭
 * 其他操作均在组件内部完成
 * 盒子样式请在使用时根据情况在父组件中设定，暂不在此设置统一展示方式
 */
import videoPlayer from "./video-player"; // 导入视频播放组件
import audioPlayer from "./audio-player"; // 导入音频播放组件
import pdfOnline from "./pdf-online"; // 导入pdf预览组件
import imgOnline from "./img-online"; // 导入img预览组件

export default {
  data(){
    return {
      loading: false, // laod状态
      type: null, // 文件类型
      options: null, // 文件地址或配置项
      show_preview: false // 是否显示文件预览
    }
  },
  props:{
    /**
     * 预览文件类型
     * video视频，audio音频，img图片，iframe其他可预览类型【txt,html,pdf】
     */
    previewType: {
      type: String,
      default: 'img'
    },
    /**
     * 文件地址或配置项
     */
    previewOptions: [Object, String],
  },
  methods: {
    // 关闭预览
    closePreview() {
      this.$emit("close");
    },
  },
  computed: {
    selfType(){
      return this.previewType;
    },
    selfOptions(){
      return this.previewOptions;
    }
  },
  components: {videoPlayer, audioPlayer, pdfOnline, imgOnline}
}
</script>

<style lang="scss">
  .file-view{
    z-index: 111;
    
    >.player-item{
      position: static;
      width: 100%;
      height: 100%;
    }
  } 
</style>
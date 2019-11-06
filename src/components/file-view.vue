<template>
  <div class="file-view" v-loading="loading">
    <!-- 视频播放器组件 -->
    <videoPlayer class="player-item" v-if="show_preview == 'video'" :options="video_options" @closeVideo="closePreview"></videoPlayer>
    <!-- 音频播放器 -->
    <audio-player class="player-item" v-else-if="show_preview == 'audio'" :url="audio_url" @closeAudio="closePreview"></audio-player>
    <!-- pdf预览组件 -->
    <pdf-online class="player-item" v-else-if="show_preview == 'iframe'" :pdfurl="pdf_url" @closePDF="closePreview"></pdf-online>
    <!-- 图片预览 -->
    <img-online  class="player-item"v-else-if="show_preview == 'img'" :url="img_url" @closeImg="closePreview"></img-online>
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
import { preDataApi } from "@/api/data-browse"; // 导入预览api
import videoPlayer from "./video-player"; // 导入视频播放组件
import audioPlayer from "./audio-player"; // 导入音频播放组件
import pdfOnline from "./pdf-online"; // 导入pdf预览组件
import imgOnline from "./img-online"; // 导入img预览组件
import { getSession } from "@/util/session";

export default {
  data(){
    return {
      show_preview: "", // 文件类型
      loading: false, 
      auth: getSession("buliderauth"),
    }
  },
  methods: {
    // 预览资料
    seeData(Id) {
      this.loading = true;
      preDataApi({ Id })
        .then(res => {
          this.loading = false;
          if (res.data.StatusCode == _gc_.StatusCode.ok) {
            let data = res.data.Data;
            switch (data.Type) {
              case _gc_.fileType.video:
                this.video_options = {
                  sources: [
                    {
                      type: "video/mp4",
                      src: data.Url + "&token=" + this.auth
                    }
                  ]
                };
                this.show_preview = "video";
                break;
              case _gc_.fileType.audio:
                this.show_preview = "audio";
                this.audio_url = data.Url + "&token=" + this.auth;
                break;
              case _gc_.fileType.txt:
              case _gc_.fileType.html:
                this.pdf_url = data.Url;
                this.show_preview = "iframe";
                break;
              case _gc_.fileType.pdf:
                this.pdf_url =
                  "/static/pdf/web/viewer.html?file=" +
                  encodeURIComponent(
                    data.Url + "&token=" + this.auth + "&.pdf"
                  );
                this.show_preview = "iframe";
                break;
              case _gc_.fileType.img:
                this.show_preview = "img";
                this.img_url = data.Url + "&token=" + this.auth;
                break;
            }
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message.error("网络连接失败！"+ err);
        });
    },
    // 关闭预览
    closePreview() {
      this.show_preview = "";
      this.$emit("close");
    },
  },
  components: {videoPlayer, audioPlayer, pdfOnline, imgOnline}
}
</script>

<style lang="scss">
   .file-view{
    z-index: 222;
    
    >.player-item{
      position: static;
      width: 100%;
      height: 100%;
    }
   }
   
</style>
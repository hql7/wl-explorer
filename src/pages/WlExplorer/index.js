import wlExplorer from "./index.vue";
wlExplorer.install = function(Vue) {
  Vue.component(wlExplorer.name, wlExplorer);
};
export default wlExplorer;
<template>
  <div style="height:100%; position:relative">
    <div style="height: 80%;">
      <mainmenu></mainmenu>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

import MainMenu from '../components/mainmenu'

export default {
  components: {
    'mainmenu': MainMenu
  },
  data () {
    return {}
  }
}
</script>
<style lang="scss">
  @import "../scss/app.scss";
  @import "~leaflet/dist/leaflet.css";
</style>

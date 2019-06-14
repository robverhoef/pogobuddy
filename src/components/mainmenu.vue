<template>
  <div id="mainmenu">
    <div class="navbar">
      <div class="navbar-brand">
        <div class="navbar-item">
          <strong>PoGo Buddy</strong>
        </div>
          <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarmenu" @click.prevent="toggleMenu">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div id="navbarmenu" :class="'navbar-menu'+(menuActive?' is-active':'')">
        <div class="navbar-start">

          <div class="navbar-item">
            <a href="#" @click.stop="goMaps()">Kaart</a>
          </div>
          <div class="navbar-item">
            <a href="#" @click.stop="goStats()">Shiny stats</a>
          </div>
          <div class="navbar-item">
            <a href="#" @click.stop="goHelp()">Help!</a>
          </div>

          <div class="navbar-item">

          </div>
        </div>
        <div class="navbar-end">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menuActive: false,
      mapFollows: false
    }
  },
  methods: {
    toggleMenu () {
      this.menuActive = !this.menuActive
    },
    goMaps () {
      this.menuActive = false
      this.$router.push('/map')
    },
    goStats () {
      this.menuActive = false
      this.$router.push('/shinystats')
    },
    goHelp () {
      this.menuActive = false
      this.$router.push('/help')
    }
  }
}
</script>

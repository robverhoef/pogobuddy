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
            <router-link to="map" @click="closeMenu()">Kaart</router-link>
          </div>

          <div class="navbar-item">
            <router-link to="tasks" @click="closeMenu()">Research Task lijst</router-link>
          </div>

          <div class="navbar-item">
            <router-link to="shinystats" @click="closeMenu()">Shiny stats</router-link>
          </div>

          <div class="navbar-item">
            <router-link to="help" @click="closeMenu()">Help!</router-link>
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
      // show or hide main menu when on small screen
      this.menuActive = !this.menuActive
    },
    closeMenu () {
      console.log('closeMenu')
      this.menuActive = false
    }
  }
}
</script>

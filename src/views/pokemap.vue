<template>
  <div style="height: 100%">
    <div class="has-text-centered" v-if="initialpos===null">
       Ik zoek jouw positie op…
      <div class="lds-ripple"><div></div><div></div></div>
    </div>
    <l-map :zoom="zoom" :center="initialpos" ref="mymap" v-else>
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker :lat-lng="position" :icon="moiIcon()">
        <l-tooltip content="Je bent nu hier, hoop ik…"></l-tooltip>
      </l-marker>
      <l-marker v-for="(gym, index) in this.filteredGyms"
        :lat-lng="getloc(gym)"
        :key="'m'+index"
        :icon="gymIcon(gym)">
        <l-tooltip :content="gym.gymname"></l-tooltip>
        <l-popup>
          <div v-html="gymInfo(gym)"></div>
        </l-popup>
      </l-marker>

      <l-marker v-for="(astop, index) in this.filteredStops"
        :lat-lng="{lat: astop.lat, lng: astop.lon}"
        :key="'stop'+index"
        :icon="stopIcon(astop)">
        <l-tooltip :content="astop.name+(astop.fieldresearch.length > 0?'<br/>'+astop.fieldresearch[0].name:'')"></l-tooltip>
         <l-popup>
          <div v-html="stopInfo(astop)"></div>
        </l-popup>
      </l-marker>
    </l-map>
    <div class="container">
      <div class="columns map-controls is-mobile">
        <div class="column is-4" v-if="position!==null">
          <a href="#" id="bCenter" class="is-small button" @click.prevent="centerMe">
            <span class="icon"><i class="typcn typcn-location-outline"></i></span> <span>Waar ben ik?</span>
          </a>
        </div>

        <div class="column is-4" v-if="position!==null">
          <div class="field">
            <input type="checkbox"
              class="switch" id="followmap"
              v-model="mapFollows"
              @change="toggleFollows"
              :true-value="true"
              :false-value="false">
              <label for="followmap">Kaart volgt mij</label>
          </div>
        </div>
        <div class="column is-4" v-if="position!==null">
          <a :href="telegram_url">Meedoen</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { LMap, LTileLayer, LMarker, LTooltip, LPopup } from 'vue2-leaflet'
import axios from 'axios'
const L = window.L
export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
    LPopup
  },
  data () {
    return {
      geoid: null, // id for geo watcher
      zoom: 16,
      telegram_url: window.TELEGRAM_GROUP_URL,
      // url:'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
      url: window.MAP_URL,
      attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
      initialpos: null,
      gyms: [],
      stops: [],
      mapFollows: false
    }
  },
  computed: {
    position: {
      get: function () {
        return this.$store.state.position
      },
      set: function (value) {
        this.$store.commit('updatePosition', value)
      }
    },
    filteredStops () {
      return this.stops
    },
    filteredGyms () {
      return this.gyms
    }
  },

  methods: {
    requestInterval (fn, delay) {
      var requestAnimFrame = (function () {
        return window.requestAnimationFrame || function (callback, element) {
          window.setTimeout(callback, 1000 / 60)
        }
      })()
      var start = new Date().getTime()
      var handle = {}
      function loop () {
        handle.value = requestAnimFrame(loop)
        var current = new Date().getTime()
        var delta = current - start
        if (delta >= delay) {
          fn.call()
          start = new Date().getTime()
        }
      }
      handle.value = requestAnimFrame(loop)
      return handle
    },

    updatePosition (pos) {
      const crd = pos.coords
      this.position = { lat: crd.latitude, lng: crd.longitude }
      if (this.initialpos === null) {
        this.initialpos = this.position
      }
      if (this.mapFollows && this.$refs.mymap) {
        this.$refs.mymap.mapObject.flyTo(this.position, 16, { animate: true })
      }
    },

    updatePositionError (err) {
      console.error(err)
    },

    refreshGymsAndStops () {
      axios.get(window.API_BASE_URL + '/api/gymlist')
        .then((response) => {
          this.gyms = response.data
        })
        .catch((error) => {
          console.error(error)
        })

      axios.get(window.API_BASE_URL + 'api/stoplist')
        .then((response) => {
          this.stops = response.data
        })
        .catch((error) => {
          console.error(error)
        })
    },

    gymIcon (gym) {
      const icons = [
        'images/Gym.svg',
        'images/Gym_EX.svg',
        'images/Gym_active.svg',
        'images/Gym_active_Ex.svg'
      ]
      let gymstatus = 0
      if (gym.exRaidTrigger && gym.raid.length === 0) { gymstatus = 1 }
      if (!gym.exRaidTrigger && gym.raid.length > 0) { gymstatus = 2 }
      if (gym.exRaidTrigger && gym.raid.length > 0) { gymstatus = 3 }

      return L.icon({
        iconUrl: icons[gymstatus],
        iconSize: [24, 40],
        iconAnchor: [12, 40]
      })
    },

    stopIcon (stop) {
      const icons = [
        'images/Stop.svg',
        'images/Stop_active.svg'
      ]
      let stopstatus = stop.fieldresearch.length > 0 ? 1 : 0
      return L.icon({
        iconUrl: icons[stopstatus],
        iconSize: [12, 20],
        iconAnchor: [6, 20]
      })
    },

    getloc: function (place) {
      if (place !== null && place.lat && place.lon) {
        return { lat: place.lat, lng: place.lon }
      }
      return { lat: 0, lng: 0 }
    },

    converttime (tmstmp) {
      let d = new Date(tmstmp * 1000)
      let out = d.getHours() + ':' + d.getMinutes()
      return out
    },

    stopInfo (stop) {
      let out = '<strong>' + stop.name + '</strong><br/>'
      if (stop.fieldresearch.length > 0) {
        out += stop.fieldresearch[0].name + '<br>'
      }
      out += '<a href="' + stop.googleMapsLink + '" target="_blank">Route</a>'
      return out
    },

    gymInfo (gym) {
      let out = '<strong>' + gym.gymname + '</strong><br/>'
      for (let a = 0; a < gym.raid.length; a++) {
        out += 'Tot: ' + this.converttime(gym.raid[a].endtime) + ' <strong>' + gym.raid[0].target + '</strong><br>'
        let accounts = 0
        for (let b = 0; b < gym.raid[a].raidusers.length; b++) {
          accounts += parseInt(gym.raid[a].raidusers[b].accounts)
        }
        out += 'Accounts aangemeld: ' + accounts + '<br/> <br/>'
      }
      out += '<a href="' + gym.googleMapsLink + '" target="_blank">Route</a>'
      return out
    },

    moiIcon () {
      return L.icon({
        iconUrl: 'images/Moi.svg',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
    },
    centerMe () {
      this.$refs.mymap.mapObject.flyTo(this.position, 16)
    },
    toggleFollows () {
      this.$emit('onchangemapfollows', this.mapFollows)
    },
    changeMapFollows (what) {
      this.mapFollows = what
    }
  },

  mounted () {
    if (this.initialpos === null) {
      this.initialpos = this.position
    }
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        // timeout: 0,
        maximumAge: 5000
      }
      this.geoid = navigator.geolocation.watchPosition(this.updatePosition, this.updatePositionError, options)
    } else {
      this.$toastr.e('Browser ondersteunt locatie niet…')
    }
    this.requestInterval(this.refreshGymsAndStops, 60000)
    this.refreshGymsAndStops()
  },

  beforeDestroy: function () {
    if (navigator.geolocation) {
      navigator.geolocation.clearWatch(this.geoid)
    }
  }
}
</script>

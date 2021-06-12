<template>
  <div class="container">
    <div class="columns">
      <div class="column">
        <h2 class="is-title is-size-4">
          Er zijn {{ tasks.length }} Field Research Tasks:
        </h2>
        <div v-for="(task,index) in tasks" :key="'task'+index">
          <div class="is-title is-size-5">
            <a :href="task.googleMapsLink" target="maps">{{ task.fieldresearch[0].name }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  // data returns the local state
  data () {
    return {
      stops: []
    }
  },

  /**
  * computed contains derived values of data
  * computed values will change when data changes
  */
  computed: {
    tasks () {
      let out = []
      for (const stop of this.stops) {
        if (stop.fieldresearch.length > 0) {
          out.push(stop)
        }
      }
      // console.log('OUT', out)
      return out
    }
  },

  // all methods of this component go here…
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

    refreshStops () {
      axios.get(window.API_BASE_URL + 'api/stoplist')
        .then((response) => {
          this.stops = response.data
        })
        .catch((error) => {
          console.error(error)
        })
    }
  },

  // fired after this component becomes visible…
  mounted () {
    this.requestInterval(this.refreshStops, 60000)
    this.refreshStops()
  },

  // clean up when this component is removed
  beforeDestroy: function () {
    // ...
  }
}
</script>

<template>
  <div class="container">
    <div class="columns" v-if="targetoptions.length > 0">
      <div class="column">
        <p class="select">
          <select name="target" v-model="target" @change="targetSelected($event)">
            <option v-for="(target, index) in targetoptions" :value="target" :key="'to_' + index">{{ target }}</option>
          </select>
        </p>
      </div>
    </div>
    <div class="columns" v-if="targetoptions.length > 0">
      <div class="column">
        <table class="table is-striped">
          <caption>Totaal <button type="button" v-clipboard="totaltext" @success="copysuc6">📋</button></caption>
          <tbody>
            <tr>
              <th>✨</th>
              <td>{{shinytotal.shiny}}</td>
            </tr>
            <tr>
              <th>👫</th>
              <td>{{shinytotal.spelers}}</td>
            </tr>
            <tr>
              <th>%</th>
              <td>{{shinytotal.percentage}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="columns" v-if="targetoptions.length > 0">
      <div class="column">
        <table class="table is-striped">
          <caption>Per dag <button type="button" v-clipboard="bydaytext" @success="copysuc6">📋</button></caption>
          <thead>
            <tr>
              <th class="has-text-right">Pokémon</th>
              <th class="has-text-right">✨</th>
              <th class="has-text-right">👫</th>
              <th class="has-text-right">%</th>
              <th class="has-text-right">📅</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(target, index) in byday" :key="'bd_' + index">
              <td class="has-text-right">{{ target.target }}</td>
              <td class="has-text-right">{{ target.shiny }}</td>
              <td class="has-text-right">{{ target.spelers }}</td>
              <td class="has-text-right">{{ target.percentage }}</td>
              <td class="has-text-right">{{ target.dag }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="column">
        <table class="table is-striped">
          <caption>Per uur <button type="button" v-clipboard="byhourtext" @success="copysuc6">📋</button></caption>
          <thead>
            <tr>
              <th class="has-text-right">Pokémon</th>
              <th class="has-text-right">✨</th>
              <th class="has-text-right">👫</th>
              <th class="has-text-right">%</th>
              <th class="has-text-right">⏱</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(target, index) in byhour" :key="'bh_' + index">
              <td class="has-text-right">{{ target.target }}</td>
              <td class="has-text-right">{{ target.shiny }}</td>
              <td class="has-text-right">{{ target.spelers }}</td>
              <td class="has-text-right">{{ target.percentage }}</td>
              <td class="has-text-right">{{ target.uur }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="column">
        <table class="table is-striped">
          <caption>Per Gym<button type="button" v-clipboard="bygymtext" @success="copysuc6">📋</button></caption>
          <thead>
            <tr>
              <th class="has-text-right">Pokémon</th>
              <th class="has-text-right">✨</th>
              <th class="has-text-right">👫</th>
              <th class="has-text-right">%</th>
              <th class="has-text-right">Gym</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(target, index) in bygym" :key="'bg_' + index">
              <td class="has-text-right">{{ target.target }}</td>
              <td class="has-text-right">{{ target.shiny }}</td>
              <td class="has-text-right">{{ target.spelers }}</td>
              <td class="has-text-right">{{ target.percentage }}</td>
              <td class="has-text-right">{{ target.gymname }}</td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
    <div  v-if="targetoptions.length == 0">
      Er zijn nog geen shiny stats…
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      targetoptions: [],
      target: '',
      byhour: [],
      byday: [],
      bygym: [],
      shinytotal: {
        shiny: 0,
        spelers: 0,
        percentage: 0
      }
    }
  },
  computed: {
    totaltext () {
      let out = `** ✨\t${this.shinytotal.shiny}**
👫\t${this.shinytotal.spelers}
%\t${this.shinytotal.percentage}

`
      return out
    },
    byhourtext () {
      let out = '**Per uur **\n**Pokémon\t✨\t👫\t%\t⏱**\n'
      for (var target of this.byhour) {
        out += target.target + '\t'
        out += target.shiny + '\t'
        out += target.spelers + '\t'
        out += target.percentage + '\t'
        out += target.uur + '\n'
      }
      out += '\n'
      return out
    },
    bydaytext () {
      let out = '**Per dag **\n**Pokémon\t✨\t👫\t%\t📅**\n'
      for (var target of this.byday) {
        out += target.target + '\t'
        out += target.shiny + '\t'
        out += target.spelers + '\t'
        out += target.percentage + '\t'
        out += target.dag + '\n'
      }
      out += '\n'
      return out
    },
    bygymtext () {
      let out = '**Per gym **\n**Pokémon\t✨\t👫\t%\tGym**\n'
      for (var target of this.bygym) {
        out += target.target + '\t'
        out += target.shiny + '\t'
        out += target.spelers + '\t'
        out += target.percentage + '\t'
        out += target.gymname + '\n'
      }
      out += '\n'
      return out
    }
  },
  methods: {
    targetSelected (event) {
      console.log(event)
      this.updateStats()
    },
    async updateStats () {
      if (this.target) {
        axios.get(window.endpoint + 'api/shiny/' + this.target + '/hour')
          .then(response => {
            this.byhour = response.data
          })
        axios.get(window.endpoint + 'api/shiny/' + this.target + '/day')
          .then(response => {
            this.byday = response.data
          })
        axios.get(window.endpoint + 'api/shiny/' + this.target + '/gym')
          .then(response => {
            this.bygym = response.data
          })
        axios.get(window.endpoint + 'api/shinytotal/' + this.target)
          .then(response => {
            this.shinytotal = response.data
          })
      }
    },
    copysuc6 () {
      this.$toastr.s('Gekopieerd!')
    }
  },

  mounted () {
    axios.get(window.API_BASE_URL + 'api/shiny/targetoptions').then(response => {
      console.log('target options', response.data)
      this.targetoptions = response.data
      if (this.targetoptions.length > 0) {
        this.target = this.targetoptions[0]
      }
      this.updateStats()
    })
  }
}

</script>

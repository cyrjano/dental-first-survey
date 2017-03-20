<template>
  <div class="d-flex flex-column">
    <div class="d-flex flex-row justify-content-end" style="min-height:35px">
        <b-button @click="showSites">Show Sites</b-button>
    </div>
    <div v-if="show" class="scrollable flex-grow">
      <b-table stripped :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage" :filter="filter">
        <template slot="name" scope="item">
          {{item.value}}
        </template>
        <template slot="type" scope="item">
          {{item.value}}
        </template>
        <template slot="owner" scope="item">
          {{item.value}}
        </template>
        <template slot="offlineAction" scope="item">
          <b-btn size="sm" @click="details(item.item)">Download</b-btn>
        </template>
      </b-table>
    </div>
    <div v-if="show">
      <b-pagination class="justify-content-center" size="md" :total-rows="items.length" :per-page="perPage" v-model="currentPage" />
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      currentPage: 1,
      perPage: 10,
      filter: '',
      fields: {
        name: {
          label: 'Site Name',
          sortable: true
        },
        type:{
          label:'Grade'
        },
        owner: {
          label: 'Owner',
          sortable: true
        },
        offlineAction: {
          label: 'Download'
        }
      }
    }
  },
  computed: {
    show () {
      return this.$store.state.sites.length > 0
    },
    items () {
      return this.$store.state.sites
    }
  },
  methods: {
    showSites () {
      this.$store.dispatch('getSites', {retry: true}).then((sites) => {
        if (sites) {
          console.log(sites)
        }
      })
    }
  }
}
</script>
<style>
.scrollable{
  overflow:scroll;
}
</style>

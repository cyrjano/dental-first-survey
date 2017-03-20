<template>
  <div class="d-flex flex-column">
    <div class="d-flex flex-row justify-content-start">
      <div class="ml-auto">
        <b-button @click="showSites">Show Sites</b-button>
      </div>
    </div>
    <div :show="showSchools" class="flex-grow">
      <b-table stripped hover :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage" :filter="filter">
        <template slot="name" scope="item">
          {{item.value}}
        </template>
        <template slot="owner" scope="item">
          {{item.value}}
        </template>
        <template slot="offlineAction" scope="item">
          <b-btn size="sm" @click="details(item.item)">Download</b-btn>
        </template>
      </b-table>
      <div>
        <b-pagination class="justify-content-center" size="md" :total-rows="items.length" :per-page="perPage" v-model="currentPage" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      currentPage: 1,
      perPage: 2,
      filter: '',
      fields: {
        name: {
          label: 'Site Name',
          sortable: true
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
    showSchools () {
      return !!this.items.length
    },
    items () {
      return [
        {
          name: 'School1',
          id: 'id1',
          owner: 'Diana Olivares'
        },
        {
          name: 'School2',
          id: 'id2',
          owner: 'Diana Olivares'
        },
        {
          name: 'School3',
          id: 'id3',
          owner: 'Alejandro Perez'
        }
      ]
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
</style>

<template>
  <div id="app">
    <select class="c-txt__input c-txt__input--select" @change="selectRecipient($event)">
     <option v-if="appLocation === 'ticket_sidebar'" v-for="address in addresses" :value="address.email"
      :selected="recipient === address.email">
        <span v-if="address.default === true">{{$I18N('default_label')}} </span>{{address.email}}
     </option>
     <option v-if="appLocation === 'new_ticket_sidebar'" v-for="address in addresses" :value="address.email"
      :selected="address.default == true">
        <span v-if="address.default === true">{{$I18N('default_label')}} </span>{{address.email}}
     </option>
    </select>
  </div>
</template>

<script>
import zaf from '@/libs/ZAFClient'
export default {
  name: 'zd-app',
  data() {
    return {
      addresses: [],
      recipient: null,
      appLocation: null
    };
  },
  methods: {
    selectRecipient(event) {
      this.updateRecipient(event.target.value);
    },

    populateList: function() {
      return zaf.client.get('ticket.recipient')
      .then((response) => {
        this.recipient = response['ticket.recipient'];
        if (!!localStorage.getItem('addresses')) {
          return localStorage.getItem('addresses');
        }
        return this.getAddresses();
      });

    },

    updateRecipient: function(email) {
      if (this.appLocation === 'new_ticket_sidebar') {
          this.setRecipient(email);
      } else {
        zaf.client.request({
          url: `/api/v2/tickets/${zaf.TICKET_ID}.json`,
          type: 'PUT',
          data: {
            ticket: {
              recipient: email
            }
          }
        })
        .then((response) => {
          zaf.client.invoke('notify', `${this.$I18N('notification_message', email)}`)
        });
      }
    },

    /**
     * Get support addresses
     *
     * @param {Array||Null} previuosAddresses
    */
    getAddresses: function(nextPage, previuosAddresses) {
      let addresses = previuosAddresses || [];
      return zaf.client.request({
        url: nextPage || '/api/v2/recipient_addresses.json'
      })
      .then((response) => {
        addresses = addresses.concat(response.recipient_addresses);
        if(!!response.next_page) {
          return this.getAddresses(response.next_page);
        } else {
          localStorage.setItem('addresses', JSON.stringify(addresses));
          return addresses;
        }
      });
    },

    /**
     * set ticket current recipient
     *
     * 
    */
    setRecipient: function(email) {
      zaf.client.set('ticket.recipient', email)
      .then((response) => {
        zaf.client.invoke('notify', `${this.$I18N('notification_message', email)}`)
      });
    },
  },
  created() {
    console.log('created');
    this.populateList()
    .then((addresses) => {
      if (typeof(addresses) === "string") {
        addresses = JSON.parse(addresses);
      }
      this.addresses = addresses;
      this.appLocation = zaf.appLocation;

    });
  },
  mounted() {
    zaf.resizeFrame(this.$el.scrollHeight)
  },
  updated() {
    zaf.resizeFrame(this.$el.scrollHeight)
  }
};
</script>

<style lang="scss">
#app {
  text-align: center;
}
</style>
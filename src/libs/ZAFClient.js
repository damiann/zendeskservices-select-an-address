import ZAFClient from 'zendesk_app_framework_sdk'

export default {
  client: null,
  TICKET_ID: null,
  appLocation: null,
  recipient: null,

  init() {
    this.client = ZAFClient.init()
  },

  /**
   * It sets the frame height using on the passed value.
   * If no value has been passed, 80 will be set as default heigth.
   *
   * @param {Int} newHeight
   */
  resizeFrame(appHeight) {
    this.client.invoke('resize', {width: '100%', height: `${appHeight}px`})
  },

  /**
   * It retrieves the current user object and set the instance property this.currentLocale
   */
  async setCurrentUser() {
    const response = await this.client.get('currentUser')
    this.currentUser = response.currentUser
  },

  /**
   * pass the current ticket id to a global variable
   *
   * @param {Int} ticketId
  */
  setTicketId(ticketId) {
    this.TICKET_ID = ticketId;
  },

  /**
   * set ticket current recipient
   *
   * @param {String} appLocation
  */
  getAppLocation(appLocation) {
    this.appLocation = appLocation;
  }
}
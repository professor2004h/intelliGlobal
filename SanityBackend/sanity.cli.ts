import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '99kpz7t0',
    dataset: 'production'
  },

  /**
   * Studio hostname and deployment configuration
   */
  studioHost: 'intelli-vizax',

  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
    appId: 'rjzxyvu2ny8ddn5f5nfcpml9'
  }
})

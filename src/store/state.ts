import { Channel } from '@/@types/chat'

export interface State {
  currentChannel: Channel | null
  user: firebase.default.UserInfo | null
}

const state = (): State => ({
  currentChannel: null,
  user: null
})

export default state

export interface State {
  currentChannel: firebase.default.database.DataSnapshot | null
  user: firebase.default.UserInfo | null
}

const state = (): State => ({
  currentChannel: null,
  user: null
})

export default state

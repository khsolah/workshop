export interface State {
  user: firebase.default.UserInfo | null
}

const state = (): State => ({
  user: null
})

export default state

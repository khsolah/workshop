import { MutationTree } from 'vuex'
import { State } from './state'

export enum MutationTypes {
  SET_USER = 'SET_USER',
  SET_CURRENT_CHANNEL = 'SET_CURRENT_CHANNEL'
}

export interface Mutations<S = State> {
  [MutationTypes.SET_USER]: (
    state: S,
    payload: firebase.default.User | null
  ) => void
  [MutationTypes.SET_CURRENT_CHANNEL]: (
    state: S,
    payload: firebase.default.database.DataSnapshot
  ) => void
}

const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_USER]: (state, payload) => {
    state.user = payload
  },
  [MutationTypes.SET_CURRENT_CHANNEL]: (state, payload) => {
    state.currentChannel = payload
  }
}

export default mutations

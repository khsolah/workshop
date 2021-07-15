import { MutationTree } from 'vuex'
import { State } from './state'

export enum MutationTypes {
  SET_USER = 'SET_USER'
}

export interface Mutations<S = State> {
  [MutationTypes.SET_USER]: (
    state: S,
    payload: firebase.default.User | null
  ) => void
}

const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_USER]: (state, payload) => {
    state.user = payload
  }
}

export default mutations

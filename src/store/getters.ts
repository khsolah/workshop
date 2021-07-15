import { GetterTree } from 'vuex'
import { State } from './state'

export enum GetterTypes {
  GET_USER = 'GET_USER'
}

export interface Getters<S = State> {
  [GetterTypes.GET_USER]: (state: S) => State['user']
}

const getters: GetterTree<State, State> & Getters = {
  [GetterTypes.GET_USER]: ({ user }) => user
}

export default getters

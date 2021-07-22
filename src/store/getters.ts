import { GetterTree } from 'vuex'
import { State } from './state'

export enum GetterTypes {
  GET_USER = 'GET_USER',
  GET_CURRENT_CHANNEL = 'GET_CURRENT_CHANNEL'
}

export interface Getters<S = State> {
  [GetterTypes.GET_USER]: (state: S) => State['user']
  [GetterTypes.GET_CURRENT_CHANNEL]: (state: S) => State['currentChannel']
}

const getters: GetterTree<State, State> & Getters = {
  [GetterTypes.GET_USER]: ({ user }) => user,
  [GetterTypes.GET_CURRENT_CHANNEL]: ({ currentChannel }) => currentChannel
}

export default getters

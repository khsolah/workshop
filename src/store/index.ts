import { InjectionKey } from 'vue'
import { CommitOptions, createStore, Store as VuexStore } from 'vuex'
import getters, { Getters } from './getters'
import mutations, { Mutations } from './mutations'
import state, { State } from './state'

export interface Store<S = State>
  extends Omit<VuexStore<S>, 'commit' | 'getters'> {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>
  }
}

export const key: InjectionKey<Store<State>> = Symbol('Store')

const store: Store<State> = createStore({
  state: state,
  getters: getters,
  mutations: mutations,
  actions: {},
  modules: {}
})

export default store

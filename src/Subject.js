import {ObserverIframe} from './Observer'
import {isFunction, isArray, cloneWithout, identity} from './utils'
import {
  ADD_IN_BROADCAST_LIST,
  DEL_IN_BROADCAST_LIST,
  INIT_STATE
} from './const'

export default class Subject {
  constructor ({ ids, store }) {
    this.childs = isArray(ids) ? ids : []
    this.observerList = []
    this.store = store
    this.convert = identity
    this.init()
    debugger
  }

  addObserver (id) {
    let child = this.childs.find(item => item === id)
    if (!child) return
    const iframe = document.getElementById(id)
    debugger
    if (iframe && iframe.tagName === 'IFRAME') {
      let observer = new ObserverIframe({id, origin: child.origin, el: iframe})
      this.observerList.push(observer)
      // 排除内部 mutation
      const payload = cloneWithout(this.store.state, [Subject.moduleName])
      this.notifyObserver(observer, {
        type: INIT_STATE,
        payload: payload
      })
      return observer
    }
  }

  deleteObserver (id) {
    const index = this.observerList.map(_ => _.id).indexOf(id)
    index >= 0 && this.observerList.splice(index, 1)
  }

  notifyObserver (obs, {type, payload}) {
    obs.update(type, this.convert(payload))
  }

  notifyObservers ({id, type, payload}) {
    // 分发通知
    const _filter = this.observerList.filter(_ => _.id !== id)
    for (let obs of _filter) {
      this.notifyObserver(obs, {type, payload})
    }
  }

  init () {
    const that = this
    const {_mutations: mutations} = that.store
    const {moduleName, childPrefix} = Subject

    that.store.registerModule(moduleName, {
      namespaced: true,
      mutations: {
        [ADD_IN_BROADCAST_LIST] (state, id) {
          debugger
          that.addObserver(id)
        },
        [DEL_IN_BROADCAST_LIST] (state, id) {
          debugger
          that.deleteObserver(id)
        }
      }
    })

    // add child mutations
    Object.entries(mutations).forEach(([type, funcList]) => {
      mutations[childPrefix + type] = funcList.map(f => (data) => {
        const {id, payload} = data;
        debugger
        f(payload)
        that.notifyObservers({id, type, payload})
      })
    })

    const VALID_TYPE_RE = new RegExp(`^(${childPrefix}|${moduleName})`)
    that.store.subscribe(({type, payload}, state) => {
      if (VALID_TYPE_RE.test(type)) return
      debugger
      that.notifyObservers({type, payload})
    })

    window.addEventListener('message', this.update.bind(this))
  }

  update ({ data: {type, payload} }) {
    const {store} = this
    if (!type || !Reflect.has(store._mutations, type)) return
    debugger
    store.commit(type, payload)
  }
}

Subject.moduleName = ''
Subject.parentPrefix = ''
Subject.childPrefix = ''

import { ObserverIframe } from './Observer'
import { isArray, cloneWithout, identity, batch, newObserver } from './utils'
import { staticOptions } from './const'
import {
  ADD_IN_BROADCAST_LIST,
  DEL_IN_BROADCAST_LIST,
  INIT_STATE
} from './const'

export default function Subject({ ids, store }) {
  let childs = isArray(ids) ? ids : []
  let observerList = []
  let convert = identity
  const initFunc = initState(init)
  // 实例一个observerlist增加监听
  const notifyObserverIframe = newObserver(invokeNotifyObserver, store)
  // 广播
  const notifyObservers = batch((obs, { type, payload}) => {
    obs.update(type, convert(payload))
  })

  initFunc(store)
  /**
   * message事件监听
   */
  function init() {
    window.addEventListener('message', update)
  }

  function initState(fn) {
    return function (DepStore) {
      registerModule(DepStore, staticOptions.moduleName)
      invokeMainMutation(DepStore, staticOptions.childPrefix)
      invokeObserverMutation(DepStore, { CHILD_: staticOptions.childPrefix, VI_SYNC: staticOptions.moduleName})
      return fn.apply(null);
    }
  };

  /**
   * 注册内部模块，唤起/删除观察者
   * @param {*} DepStore 
   * @param {*} VI_SYNC 
   */
  function registerModule(DepStore, VI_SYNC) {
    DepStore.registerModule(VI_SYNC, {
      namespaced: true,
      mutations: {
        [ADD_IN_BROADCAST_LIST](state, id) {
          addObserver(id)
        },
        [DEL_IN_BROADCAST_LIST](state, id) {
          deleteObserver(id)
        }
      }
    })
  }

  /**
   * 子状态改变触发主mutation & 广播
   * @param {*} DepStore 
   * @param {*} CHILD_ 
   */
  function invokeMainMutation(DepStore, CHILD_) {
    const { _mutations: mutations } = DepStore
    Object.entries(mutations).forEach(([type, funcList]) => {
      mutations[CHILD_ + type] = funcList.map(item => (data) => {
        const { id, payload } = data;
        item(payload)
        // 广播
        notifyObservers(observerList, { id, type, payload })
      })
    })
  }

  /**
   * 主业务逻辑更新
   * @param {*} DepStore 
   * @param {*} param1 
   */
  function invokeObserverMutation(DepStore, {CHILD_, VI_SYNC}) {
    const VALID_TYPE_RE = new RegExp(`^(${CHILD_}|${VI_SYNC})`)
    DepStore.subscribe(({ type, payload }, state) => {
      if (VALID_TYPE_RE.test(type)) return
      notifyObservers(observerList, { type, payload })
    })
  }

  function update({ data: { type, payload } }) {
    if (!type || !Reflect.has(store._mutations, type)) return
    store.commit(type, payload)
  }

  /**
   * 增加iframe监听
   */
  function addObserver(id) {
    const child = childs.find(item => item === id)
    child && notifyObserverIframe(id, child, staticOptions.moduleName, observerList)
  }

  function deleteObserver(id) {
    const index = observerList.map(_ => _.id).indexOf(id)
    index >= 0 && observerList.splice(index, 1)
  }

  function invokeNotifyObserver(DepStore, Observer, VI_SYNC) {
    const payload = cloneWithout(DepStore.state, [VI_SYNC])
    notifyObservers(Observer, {
      type: INIT_STATE,
      payload: payload
    })
  }
}

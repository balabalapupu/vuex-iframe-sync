import Subject from './Subject'
import {Observer} from './Observer'
import {staticOptions} from './const'


// sync from parent to iframe
export const broadcast = (ids) => store => {
  return new Subject({
    ids, 
    store
  });
}

// sync from iframe to parent or other iframe
export const transfer = (options = {}) => store => {
  let {convert, created, destroyed} = options
  Observer.moduleName = staticOptions.moduleName
  Observer.parentPrefix = staticOptions.parentPrefix
  Observer.childPrefix = staticOptions.childPrefix

  return new Observer({
    id: options.id || window.frameElement.id,
    store,
    convert,
    created,
    destroyed
  })
}

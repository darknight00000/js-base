function isType (obj, type) {
  const types = {
    array: '[object Array]',
    function: '[object Function]',
    regexp: '[object RegExp]',
    date: '[object Date]',
    set: '[object Set]',
    weakset: '[object WeakSet]',
    map: '[object Map]',
    weakmap: '[object WeakMap]'
  }
  const realType = Object.prototype.toString.call(obj)
  return types[type] === realType
}

function isObject (obj) {
  return (obj && typeof obj === 'object') || isType(obj, 'function')
}

function deepClone (src) {
  const seen = new WeakMap()

  function clone (data) {
    if (!isObject(data)) {
      return data
    }

    if (isType(data, 'regexp') || isType(data, 'date')) {
      return new data.constructor(data)
    }

    if (isType(data, 'function')) {
      return new Function(`return ${data.toString()}`)() // eslint-disable-line
    }

    let dest = seen.get(data)
    if (dest) {
      return dest
    }

    if (isType(data, 'map') || isType(data, 'weakmap')) {
      const Ctr = isType(data, 'map') ? Map : WeakMap
      dest = new Ctr()
      seen.set(data, dest)
      data.forEach((v, k) => {
        dest.set(clone(k), clone(v))
      })
      return dest
    }

    if (isType(data, 'set') || isType(data, 'weakset')) {
      const Ctr = isType(data, 'set') ? Set : WeakSet
      dest = new Ctr()
      seen.set(data, dest)
      data.forEach((v) => {
        dest.add(clone(v))
      })
      return dest
    }

    const keys = Reflect.ownKeys(data)
    const desc = Object.getOwnPropertyDescriptors(data)
    dest = isType(data, 'array') ? [] : Object.create(Object.getPrototypeOf(data), desc)
    seen.set(data, dest)
    keys.forEach((k) => {
      dest[k] = clone(data[k])
    })
    return dest
  }

  return clone(src)
}

module.exports = deepClone

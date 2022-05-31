function throttle (fn, wait) {
  let prev = 0

  return function (...args) {
    const now = Date.now()
    if (now - prev > wait) {
      prev = now
      fn.apply(this, args)
    }
  }
}

module.exports = throttle

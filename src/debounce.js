function debounce (fn, wait) {
  let timer = null

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(fn.bind(this, ...args), wait)
  }
}

module.exports = debounce

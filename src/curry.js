function curry (fn, len) {
  len = len || fn.length
  return function (...args) {
    return args.length >= len
      ? fn.apply(this, args)
      : curry(fn.bind(this, ...args), len - args.length)
  }
}

module.exports = curry

function $new (...args) {
  const obj = {}
  const Ctr = args.shift()
  Object.setPrototypeOf(obj, Ctr.prototype)
  const ins = Ctr.apply(obj, args)
  return ins instanceof Object ? ins : obj
}

module.exports = $new

Function.prototype.$call = function (ctx, ...args) { // eslint-disable-line
  ctx = ctx || window
  ctx.$fn = this
  const res = ctx.$fn(...args)
  delete ctx.$fn
  return res
}

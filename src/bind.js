Function.prototype.$bind = function (ctx, ...args) { // eslint-disable-line
  const self = this

  return function (...bindArgs) {
    return self.call(ctx, ...args, ...bindArgs)
  }
}

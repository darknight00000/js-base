const isObject = function (obj) {
  return (obj && typeof obj === 'object') || typeof obj === 'function'
}

const resolvePromise = function (promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }
  let called
  if (isObject(x)) {
    try {
      const then = x.then
      if (typeof then === 'function') {
        then.call(
          x,
          (y) => {
            if (called) {
              return
            }
            called = true
            resolvePromise(promise2, y, resolve, reject)
          },
          (err) => {
            if (called) {
              return
            }
            called = true
            reject(err)
          }
        )
      } else {
        resolve(x)
      }
    } catch (err) {
      if (called) {
        return
      }
      called = true
      reject(err)
    }
  } else {
    resolve(x)
  }
}

class $Promise {
  static STATUS = {
    PENDING: 'PENDING',
    FULFILLED: 'FULFILLED',
    REJECTED: 'REJECTED'
  }

  static resolve (data) {
    return new $Promise((resolve) => {
      resolve(data)
    })
  }

  static reject (reason) {
    return new $Promise((resolve, reject) => {
      reject(reason)
    })
  }

  static all (proms) {
    return new $Promise((resolve, reject) => {
      const res = []
      let count = 0
      const done = (i, data) => {
        res[i] = data
        count++
        if (count === proms.length) {
          resolve(res)
        }
      }
      for (let i = 0; i < proms.length; i += 1) {
        proms[i].then(data => done(i, data), reject)
      }
    })
  }

  static race (proms) {
    return new $Promise((resolve, reject) => {
      for (let i = 0; i < proms.length; i += 1) {
        proms[i].then(resolve, reject)
      }
    })
  }

  constructor (executor) {
    this.status = $Promise.STATUS.PENDING
    this.value = undefined
    this.reason = undefined
    this.onResolved = []
    this.onRejected = []

    const resolve = (value) => {
      if (this.status === $Promise.STATUS.PENDING) {
        this.status = $Promise.STATUS.FULFILLED
        this.value = value
        this.onResolved.forEach(cb => cb())
      }
    }
    const reject = (reason) => {
      if (this.status === $Promise.STATUS.PENDING) {
        this.status = $Promise.STATUS.REJECTED
        this.value = reason
        this.onRejected.forEach(cb => cb())
      }
    }

    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err }

    const promise2 = new $Promise((resolve, reject) => {
      if (this.status === $Promise.STATUS.FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        }, 0)
      }

      if (this.status === $Promise.STATUS.REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        }, 0)
      }

      if (this.status === $Promise.STATUS.PENDING) {
        this.onResolved.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          }, 0)
        })
        this.onRejected.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          }, 0)
        })
      }
    })

    return promise2
  }

  catch (cb) {
    return this.then(null, cb)
  }

  finally (cb) {
    return this.then(
      (value) => $Promise.resolve(cb()).then(() => value),
      (reason) => $Promise.resolve(cb()).then(() => { throw reason }))
  }
}

module.exports = $Promise

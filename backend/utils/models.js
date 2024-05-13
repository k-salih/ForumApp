export const toJSON = () =>
  function () {
    const obj = this.toObject({ getters: true, virtuals: true })
    obj.id = obj._id
    delete obj._id
    delete obj.__v

    return obj
  }

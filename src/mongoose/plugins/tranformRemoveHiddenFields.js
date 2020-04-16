module.exports = exports = function(schema, options) {
  schema.options.toObject = schema.options.toObject || {}
  schema.options.toObject.transform = function removeHiddenFields(doc, ret, options) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  }
}

/**
 * gte:field
 * The field under validation must be greater than or equal to the given field.
 */
export default function(data, field, message, args, get) {
  return new Promise((resolve, reject) => {
    const fieldValue = get(data, field)

    if ((typeof fieldValue) !== 'number') {
      return reject(new Error('This field should be a number'))
    }

    const expectedGTE = Number.parseInt(args[0])
    if (fieldValue < expectedGTE) {
      return reject(new Error(`Number must be greater than or equal to ${expectedGTE}`))
    }

    return resolve()
  })
}

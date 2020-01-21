export default function(data, field, message, args, get) {
  return new Promise((resolve, reject) => {
    const fieldValue = get(data, field)
    if (!fieldValue) {
      return resolve()
    }

    const expectedLength = Number.parseInt(args[0])
    if (fieldValue.length !== expectedLength) {
      return reject(new Error(`Should provide ${expectedLength} items`))
    }

    return resolve()
  })
}

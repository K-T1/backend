export default function(data, field, message, args, get) {
  return new Promise((resolve, reject) => {
    const fieldValue = get(data, field)
    if (!fieldValue) {
      return resolve()
    }

    if (!fieldValue.typeCode) {
      return reject(new Error('type required'))
    }
    if (!fieldValue.baseUrl) {
      return reject(new Error('baseUrl required'))
    }
    if (!fieldValue.urls) {
      return reject(new Error('urls requried'))
    }

    return resolve()
  })
}

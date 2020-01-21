class SimpleFormatter {
  constructor() {
    this.hasError = false
    this.errors = {}
  }

  addError(error, field, validation, args) {
    let message = error
    if (error instanceof Error) {
      validation = 'ENGINE_EXCEPTION'
      message = error.message
    }

    this.hasError = true
    this.errors[field] = message
  }

  toJSON() {
    return this.hasError ? this.errors : null
  }
}

export default SimpleFormatter

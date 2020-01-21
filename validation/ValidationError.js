class ValidationError extends Error {
  constructor(errors, fileName, lineNumber) {
    super('Validation failed', fileName, lineNumber)
    Error.captureStackTrace(this, 'Validation failed')
    this.errors = errors
  }
}

export default ValidationError

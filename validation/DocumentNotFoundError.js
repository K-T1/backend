class DocumentNotFoundError extends Error {
  constructor() {
    super('Document not found')
  }
}

export default DocumentNotFoundError

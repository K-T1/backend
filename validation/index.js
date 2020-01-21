import { configure, validations, validateAll } from 'indicative'
import SimpleFormatter from './SimpleFormatter'
import ValidationError from './ValidationError'
import rules from './rules'

const messages = {
  required: 'This field is required',
  required_when: 'This field is required',
  date: 'This field should be a valid date',
  string: 'This field should be a text',
  number: 'This field should be a number',
  boolean: 'This field should be true or false',
  array: 'This field should be a list',
  in: 'This field should be one of valid choices'
}

validations.image = rules.image
validations.length = rules.length
validations.gte = rules.gte

export default {
  ValidationError,

  init: () => {
    configure({
      messages,
      FORMATTER: SimpleFormatter
    })
  },

  validateAll: async(data, rules, customMessages = {}) => {
    try {
      await validateAll(data, rules, { ...customMessages, ...messages })
    } catch (error) {
      let errorMessage = {};
      error.forEach((e) => {
        errorMessage[e.field] = e.message
      })
      throw new ValidationError(errorMessage)
    }
  }
}

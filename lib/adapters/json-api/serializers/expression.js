import Builder from '../../../queries/builders/expression'
import Condition from './condition'

class Expression {
  static serialize (builder) {
    let output = ''

    builder.getItems().forEach(item => {
      if (output) {
        output += item.operator === 'OR' ? ',' : ';'
      }

      output += item.constraint instanceof Builder ? `(${Expression.serialize(item.constraint)})` : Condition.serialize(item.constraint)
    })

    return output
  }
}

export default Expression

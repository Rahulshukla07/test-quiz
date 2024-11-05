
const joi = require("joi");

export default class InputValidation {
  private static _validate(input: any, schema: any): { isValid: boolean, error: string[] } {
    const result = schema.validate(input);
    if (result.error != null) {
      return { isValid: false, error: result.error.details.map((e: any) => e.message) };
    } else {
      return { isValid: true, error: [] };
    }
  }


  // Validate Create Quiz Input.
  public static validateCreateQuiz(input: any): { isValid: boolean, error: string[] } {
    const schema = joi.object({
      title: joi.string().required(),
      questions: joi.array().items(joi.object({
        text: joi.string().required(),
        options: joi.array().items(joi.string()).required(),
        correct_option: joi.number().required()
      })).required()
    });

    return this._validate(input, schema);
  }

}

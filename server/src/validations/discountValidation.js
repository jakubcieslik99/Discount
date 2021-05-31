import Joi from 'joi'

const commentValidation = Joi.object({
    message: Joi
        .string()
        .required()
        .max(256)
})

const updateValidation = Joi.object({
    title: Joi
        .string()
        .required()
        .max(64),
    price: Joi
        .number()
        .required()
        .integer()
        .min(0)
        .max(999999999),
    prevprice: Joi
        .number()
        .integer()
        .min(0)
        .max(999999999),
    store: Joi
        .string()
        .allow('')
        .max(24),
    freeShipping: Joi
        .bool(),
    description: Joi
        .string()
        .allow('')
        .max(512),
    discountCode: Joi
        .string()
        .allow('')
        .max(16),
    link: Joi
        .string()
        .required()
        .max(256)
        .pattern(new RegExp(/^((https?:\/\/)?)[a-zA-Z0-9]{1}[a-zA-Z0-9-.]{0,}\.[a-z]{2,13}[a-zA-Z0-9:/?#[\]@!$&'()*+,;=\-.]{0,}$/)),
    category: Joi
        .string()
        .valid(
            'artykuly_spozywcze', 
            'dom_i_ogrod', 
            'elektronika', 
            'moda', 
            'podroze', 
            'rozrywka', 
            'sport', 
            'subskrypcje_i_uslugi', 
            'zdrowie_i_uroda', 
            'inne'
        )
})

const createValidation = Joi.object({
    title: Joi
        .string()
        .required()
        .max(64),
    price: Joi
        .number()
        .required()
        .integer()
        .min(0)
        .max(999999999),
    prevprice: Joi
        .number()
        .integer()
        .min(0)
        .max(999999999),
    store: Joi
        .string()
        .allow('')
        .max(24),
    freeShipping: Joi
        .bool(),
    description: Joi
        .string()
        .allow('')
        .max(512),
    discountCode: Joi
        .string()
        .allow('')
        .max(16),
    link: Joi
        .string()
        .required()
        .max(256),
    category: Joi
        .string()
        .valid(
            'artykuly_spozywcze', 
            'dom_i_ogrod', 
            'elektronika', 
            'moda', 
            'podroze', 
            'rozrywka', 
            'sport', 
            'subskrypcje_i_uslugi', 
            'zdrowie_i_uroda', 
            'inne'
        )
})

const listValidation = Joi.object({
    category: Joi
        .string()
        .valid(
            'artykuly_spozywcze', 
            'dom_i_ogrod', 
            'elektronika', 
            'moda', 
            'podroze', 
            'rozrywka', 
            'sport', 
            'subskrypcje_i_uslugi', 
            'zdrowie_i_uroda', 
            'inne'
        )
})

export {commentValidation, updateValidation, createValidation, listValidation}

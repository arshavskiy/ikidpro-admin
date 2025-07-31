import Joi from 'joi'

// Parent form validation schema
const parentSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.empty': 'First name is required',
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters',
      'string.pattern.base': 'First name can only contain letters and spaces'
    }),
    
  lastName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.empty': 'Last name is required',
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 50 characters',
      'string.pattern.base': 'Last name can only contain letters and spaces'
    }),
    
  mobile: Joi.string()
    .pattern(/^[+]?[\d\s\-()]+$/)
    .min(10)
    .max(20)
    .required()
    .messages({
      'string.empty': 'Mobile number is required',
      'string.pattern.base': 'Please enter a valid mobile number',
      'string.min': 'Mobile number must be at least 10 digits',
      'string.max': 'Mobile number cannot exceed 20 characters'
    }),
    
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Email address is required',
      'string.email': 'Please enter a valid email address'
    }),
    
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'string.max': 'Password cannot exceed 128 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    })
})

// Child form validation schema
const childSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.empty': 'Child\'s first name is required',
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters',
      'string.pattern.base': 'First name can only contain letters and spaces'
    }),
    
  lastName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.empty': 'Child\'s last name is required',
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 50 characters',
      'string.pattern.base': 'Last name can only contain letters and spaces'
    }),
    
  gender: Joi.string()
    .valid('Male', 'Female', 'Non-binary', 'Prefer not to say')
    .required()
    .messages({
      'any.required': 'Gender is required',
      'any.only': 'Please select a valid gender option'
    }),
    
  dateOfBirth: Joi.date()
    .max('now')
    .min(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)) // Max 18 years ago
    .optional()
    .messages({
      'date.max': 'Date of birth cannot be in the future',
      'date.min': 'Child must be under 18 years old'
    }),
    
  age: Joi.number()
    .integer()
    .min(0)
    .max(18)
    .optional()
    .messages({
      'number.min': 'Age must be at least 0',
      'number.max': 'Age cannot exceed 18 years',
      'number.integer': 'Age must be a whole number'
    }),
    
  height: Joi.number()
    .min(30)
    .max(200)
    .optional()
    .messages({
      'number.min': 'Height must be at least 30 cm',
      'number.max': 'Height cannot exceed 200 cm'
    }),
    
  weight: Joi.number()
    .min(1)
    .max(150)
    .optional()
    .messages({
      'number.min': 'Weight must be at least 1 kg',
      'number.max': 'Weight cannot exceed 150 kg'
    }),
    
  medicalCondition: Joi.array()
    .items(Joi.string().min(2).max(100))
    .optional()
    .messages({
      'array.base': 'Medical conditions must be an array',
      'string.min': 'Each medical condition must be at least 2 characters',
      'string.max': 'Each medical condition cannot exceed 100 characters'
    }),
    
  limitations: Joi.array()
    .items(Joi.string().min(2).max(100))
    .optional()
    .messages({
      'array.base': 'Limitations must be an array',
      'string.min': 'Each limitation must be at least 2 characters',
      'string.max': 'Each limitation cannot exceed 100 characters'
    }),
    
  emergencyContact: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .pattern(/^[a-zA-Z\s]+$/)
      .optional()
      .allow('')
      .messages({
        'string.min': 'Emergency contact name must be at least 2 characters',
        'string.max': 'Emergency contact name cannot exceed 100 characters',
        'string.pattern.base': 'Emergency contact name can only contain letters and spaces'
      }),
      
    phone: Joi.string()
      .pattern(/^[+]?[\d\s\-()]+$/)
      .min(10)
      .max(20)
      .optional()
      .allow('')
      .messages({
        'string.pattern.base': 'Please enter a valid phone number',
        'string.min': 'Phone number must be at least 10 digits',
        'string.max': 'Phone number cannot exceed 20 characters'
      }),
      
    relationship: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s]+$/)
      .optional()
      .allow('')
      .messages({
        'string.min': 'Relationship must be at least 2 characters',
        'string.max': 'Relationship cannot exceed 50 characters',
        'string.pattern.base': 'Relationship can only contain letters and spaces'
      })
  }).optional(),
  
  notes: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Notes cannot exceed 1000 characters'
    })
})

// Validation functions
export function validateParentForm(data) {
  const { error } = parentSchema.validate(data, { abortEarly: false })
  
  if (!error) {
    return { isValid: true, errors: {} }
  }
  
  const errors = {}
  error.details.forEach(detail => {
    errors[detail.path[0]] = detail.message
  })
  
  return { isValid: false, errors }
}

export function validateChildForm(data) {
  const { error } = childSchema.validate(data, { abortEarly: false })
  
  if (!error) {
    return { isValid: true, errors: {} }
  }
  
  const errors = {}
  error.details.forEach(detail => {
    const fieldPath = detail.path.join('_')
    errors[fieldPath] = detail.message
  })
  
  return { isValid: false, errors }
}

// Helper function to validate all children at once
export function validateAllChildren(childrenArray) {
  const results = childrenArray.map((child, index) => ({
    index,
    ...validateChildForm(child)
  }))
  
  const allValid = results.every(result => result.isValid)
  const allErrors = {}
  
  results.forEach(result => {
    if (!result.isValid) {
      Object.keys(result.errors).forEach(key => {
        allErrors[`child_${result.index}_${key}`] = result.errors[key]
      })
    }
  })
  
  return { isValid: allValid, errors: allErrors }
}

export default {
  validateParentForm,
  validateChildForm,
  validateAllChildren
}

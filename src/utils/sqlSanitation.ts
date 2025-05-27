import validator from 'validator';

export function sanitizeInput<T extends Record<string, any>>(input: T, fields: Array<keyof T>): T {
  const sanitizedInput: Partial<T> = {};

  fields.forEach((field) => {
    const value = input[field];

    if (!value) {
      throw new Error(`Missing required field: ${String(field)}`);
    }

    if (typeof value === 'string') {
      let sanitizedValue = value.trim();


      if (validator.contains(sanitizedValue, "'") || validator.contains(sanitizedValue, "--") || validator.contains(sanitizedValue, ";")) {
        throw new Error(`Invalid characters detected in field: ${String(field)}`);
      }

      sanitizedValue = validator.escape(sanitizedValue); 

      sanitizedInput[field] = sanitizedValue as T[typeof field];
    } else {
      sanitizedInput[field] = value;
    }
  });

  return sanitizedInput as T;
}

// ' OR 1=1; --
// ' UNION SELECT null, null, null; --


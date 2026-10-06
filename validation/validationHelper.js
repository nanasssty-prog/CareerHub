const validateFields = (fields) => {
  const errors = [];
  for (const [field, value] of Object.entries(fields)) {
    if (!value || value.trim() === "") {
      errors.push(`Поле "${field}" не может быть пустым.`);
    }
  }
  return errors;
};

const validateStringValue = (field, minLength, maxLength) => {
  const [name, value] = Object.entries(field)[0];
  const length = String(value ?? "").trim().length;

  if (length < minLength || length > maxLength) {
    return `Поле "${name}" должно содержать от ${minLength} до ${maxLength} символов.`;
  }
  return null;
};

const validateNumberValue = (field, minValue, maxValue) => {
  const [name, value] = Object.entries(field)[0];

  if (value === undefined || value === null || String(value).trim() === "") {
    return `Поле "${name}" должно быть числом.`;
  }
  const numberValue = Number(value);
  if (
    !Number.isFinite(numberValue) ||
    numberValue < minValue ||
    numberValue > maxValue
  ) {
    return `Поле "${name}" должно содержать числовое значение не менее ${minValue} и не более ${maxValue}.`;
  }
  if (/^\d+[.,]\d{3,}$/.test(String(value).trim())) {
    return `Поле "${name}" должно содержать не более 2 знаков после запятой.`;
  }
  return null;
};

module.exports = {
  validateFields,
  validateStringValue,
  validateNumberValue,
};

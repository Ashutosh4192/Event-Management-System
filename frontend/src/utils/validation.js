export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const validatePhone = (phone) => /^\d{10}$/.test(phone);
export const validatePinCode = (pin) => /^\d{6}$/.test(pin);
export const validateRequired = (value) => value && value.toString().trim().length > 0;

export const validateCheckoutForm = (data) => {
  const errors = {};
  if (!validateRequired(data.name)) errors.name = 'Name is required';
  if (!validateRequired(data.phone)) errors.phone = 'Phone number is required';
  else if (!validatePhone(data.phone)) errors.phone = 'Phone must be 10 digits';
  if (!validateRequired(data.email)) errors.email = 'Email is required';
  else if (!validateEmail(data.email)) errors.email = 'Invalid email format';
  if (!validateRequired(data.address)) errors.address = 'Address is required';
  if (!validateRequired(data.city)) errors.city = 'City is required';
  if (!validateRequired(data.state)) errors.state = 'State is required';
  if (!validateRequired(data.pinCode)) errors.pinCode = 'Pin code is required';
  else if (!validatePinCode(data.pinCode)) errors.pinCode = 'Pin code must be 6 digits';
  if (!validateRequired(data.paymentMethod)) errors.paymentMethod = 'Payment method is required';
  return errors;
};

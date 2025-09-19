import { useState } from "react";

interface FormData {
  guestName: string;
  email: string;
  whatsappNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyContact: string;
  emergencyRelation: string;
}

export const useGuestDetailsForm = () => {
  const [formData, setFormData] = useState<FormData>({
    guestName: "",
    email: "",
    whatsappNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    emergencyContact: "",
    emergencyRelation: ""
  });

  // Enhanced email validation with security checks
  const validateEmail = (email: string) => {
    const emailRegex = /^[A-Za-z0-9]([A-Za-z0-9._%-]*[A-Za-z0-9])?@[A-Za-z0-9]([A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) return false;
    
    // Additional security checks
    if (email.length > 254) return false; // RFC 5322 limit
    if (email.includes('..')) return false; // No consecutive dots
    
    // Check for suspicious patterns (basic)
    const suspiciousPatterns = /(\+|script|javascript|<|>|['"&%;()\\])/i;
    if (suspiciousPatterns.test(email)) return false;
    
    return true;
  };
  
  // Enhanced phone validation  
  const validatePhone = (phone: string) => {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (!/^\+?[1-9]\d{7,14}$/.test(cleanPhone)) return false;
    if (cleanPhone.length < 8 || cleanPhone.length > 15) return false;
    return true;
  };

  // Enhanced input sanitization with security measures
  const sanitize = (input: string, maxLength: number = 100) => {
    return input
      .trim()
      .replace(/[<>"'&%;()\\+]/g, '') // Remove potentially dangerous characters
      .slice(0, maxLength); // Prevent buffer overflow attacks
  };

  // Name-specific validation
  const validateName = (name: string) => {
    if (name.length < 2 || name.length > 100) return false;
    // Allow letters, spaces, hyphens, apostrophes but no numbers or special chars
    if (!/^[A-Za-z\s\-']+$/.test(name)) return false;
    // No excessive repetition (potential spam)
    if (/(.)\1{4,}/.test(name)) return false;
    return true;
  };

  // Pincode validation for Indian format
  const validatePincode = (pincode: string) => {
    return /^[1-9][0-9]{5}$/.test(pincode);
  };

  // Address validation
  const validateAddress = (address: string) => {
    if (address.length < 5 || address.length > 200) return false;
    // Basic check for meaningful content
    if (!/[a-zA-Z]/.test(address)) return false;
    return true;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    let sanitizedValue = value;
    let maxLength = 100;

    // Field-specific sanitization and length limits
    switch (field) {
      case 'guestName':
      case 'emergencyRelation':
        maxLength = 100;
        break;
      case 'email':
        maxLength = 254;
        sanitizedValue = value.toLowerCase().trim();
        break;
      case 'whatsappNumber':
      case 'emergencyContact':
        maxLength = 20;
        sanitizedValue = value.replace(/[^\d+\-\s()]/g, '');
        break;
      case 'address':
        maxLength = 200;
        break;
      case 'city':
      case 'state':
        maxLength = 50;
        break;
      case 'pincode':
        maxLength = 6;
        sanitizedValue = value.replace(/\D/g, '');
        break;
    }

    sanitizedValue = sanitize(sanitizedValue, maxLength);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
  };

  // More flexible city/state validation
  const validateCityState = (value: string) => {
    if (value.length < 2 || value.length > 100) return false;
    // Allow letters, spaces, hyphens, apostrophes, dots, and numbers for places like "Sector 5"
    if (!/^[A-Za-z0-9\s\-'.]+$/.test(value)) return false;
    return true;
  };

  const validateForm = () => {
    const required: (keyof FormData)[] = ["guestName", "email", "whatsappNumber", "address", "city", "state", "pincode"];
    
    // Check all required fields are filled
    const allFieldsFilled = required.every(field => formData[field] && formData[field].length > 0);
    console.log('All fields filled:', allFieldsFilled, formData);
    if (!allFieldsFilled) return false;
    
    // Validate each field individually with detailed logging
    const nameValid = validateName(formData.guestName);
    console.log('Name valid:', nameValid, formData.guestName);
    if (!nameValid) return false;
    
    const emailValid = validateEmail(formData.email);
    console.log('Email valid:', emailValid, formData.email);
    if (!emailValid) return false;
    
    const phoneValid = validatePhone(formData.whatsappNumber);
    console.log('Phone valid:', phoneValid, formData.whatsappNumber);
    if (!phoneValid) return false;
    
    const addressValid = validateAddress(formData.address);
    console.log('Address valid:', addressValid, formData.address);
    if (!addressValid) return false;
    
    const cityValid = validateCityState(formData.city);
    console.log('City valid:', cityValid, formData.city);
    if (!cityValid) return false;
    
    const stateValid = validateCityState(formData.state);
    console.log('State valid:', stateValid, formData.state);
    if (!stateValid) return false;
    
    const pincodeValid = validatePincode(formData.pincode);
    console.log('Pincode valid:', pincodeValid, formData.pincode);
    if (!pincodeValid) return false;
    
    // Validate optional emergency contact if provided
    if (formData.emergencyContact && !validatePhone(formData.emergencyContact)) return false;
    if (formData.emergencyRelation && !validateName(formData.emergencyRelation)) return false;
    
    console.log('Form validation passed!');
    return true;
  };

  return {
    formData,
    handleInputChange,
    validateForm
  };
};
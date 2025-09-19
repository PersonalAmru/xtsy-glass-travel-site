import { useState } from "react";

interface FormData {
  guestName: string;
  email: string;
  whatsappNumber: string;
}

export const useGuestDetailsForm = () => {
  const [formData, setFormData] = useState<FormData>({
    guestName: "",
    email: "",
    whatsappNumber: ""
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
        maxLength = 100;
        break;
      case 'email':
        maxLength = 254;
        sanitizedValue = value.toLowerCase().trim();
        break;
      case 'whatsappNumber':
        maxLength = 20;
        sanitizedValue = value.replace(/[^\d+\-\s()]/g, '');
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
    const required: (keyof FormData)[] = ["guestName", "email", "whatsappNumber"];
    
    // Check all required fields are filled
    const allFieldsFilled = required.every(field => formData[field] && formData[field].length > 0);
    if (!allFieldsFilled) return false;
    
    // Validate each field individually
    if (!validateName(formData.guestName)) return false;
    if (!validateEmail(formData.email)) return false;
    if (!validatePhone(formData.whatsappNumber)) return false;
    
    return true;
  };

  return {
    formData,
    handleInputChange,
    validateForm
  };
};
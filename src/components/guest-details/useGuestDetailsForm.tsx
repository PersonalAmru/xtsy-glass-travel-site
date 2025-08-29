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

  const validateEmail = (email: string) =>
    /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/.test(email);
  
  const validatePhone = (phone: string) =>
    /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s/g, ""));
  
  const sanitize = (s: string) => s.trim();

  const handleInputChange = (field: keyof FormData, value: string) =>
    setFormData(prev => ({ ...prev, [field]: sanitize(value) }));

  const validateForm = () => {
    const required: (keyof FormData)[] = ["guestName", "email", "whatsappNumber", "address", "city", "state", "pincode"];
    const filled = required.every(f => formData[f] && formData[f].length > 0);
    if (!filled) return false;
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
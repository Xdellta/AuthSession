// Validation of input data
const validator = {
  email: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!emailRegex.test(email)) {
      return null;
    } 
    
    return { success: true };
  },

  password: (password: string) => {
    const minLength = password.length >= 6;
    const maxLength = password.length <= 26;
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const formula = /[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);
  
    if (!minLength || !maxLength || !hasLowerCase || !hasUpperCase || !formula) {
      return null;
    }
    
    return { success: true };
  }
};

export default validator;
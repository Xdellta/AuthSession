// Email validation
const email = (email: string): { success: boolean, status?: number } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { success: false, status: 400 };
  } 
  
  return { success: true };
}

// Password validation
const password = (password: string): { success: boolean, status?: number } => {
  const minLength = password.length >= 6;
  const maxLength = password.length <= 26;
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const formula = /[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);

  if (!minLength || !maxLength || !hasLowerCase || !hasUpperCase || !formula) {
    return { success: false, status: 400 };
  }
  
  return { success: true };
}

export default { email, password };
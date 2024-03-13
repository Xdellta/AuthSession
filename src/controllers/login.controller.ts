import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.model';
import sessionSvc from '../services/session.service';
import validator from '../utils/validator.util';

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Validation of the email formula by a function
    const emailValid = validator.email(email);

    if (!emailValid.success) {
      throw { status: emailValid.status };
    }

    // Validation of the password formula by a function
    const passwordValid = validator.password(password);
    
    if (!passwordValid.success) {
      throw { status: passwordValid.status };
    }

    // Check if the user with the provided email address exists
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      throw { status: 401 };
    }

    // Check the correctness of the password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw { status: 401 };
    }

    // Creating a session by a function and checking the result
    const createResult = await sessionSvc.create(user.user_id, res);

    if (!createResult.success) {
      throw { status: createResult.status };
    }

    return res.sendStatus(200).send('Login successful');;

  } catch(error) {
    next(error);
  }
}

export default login;
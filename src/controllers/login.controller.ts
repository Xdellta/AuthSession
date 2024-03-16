import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma.config';
import bcrypt from 'bcrypt';
import validator from '../utils/validator.util';
import sessionSvc from '../services/session.service';

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
    const user = await prisma.user.findFirst({ where: { email: { equals: email } } });

    if (!user) {
      throw { status: 401 };
    }

    // Check the correctness of the password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw { status: 401 };
    }

    // Creating a session by a function and checking the result
    const resultCreate = await sessionSvc.create(user.user_id, res);

    if (!resultCreate) {
      throw { status: 404, message: '' };
    }

    res.status(200).send('Login successful');

  } catch(error) {
    next(error);
  }
}

export default login;
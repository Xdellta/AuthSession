import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma.config';
import bcrypt from 'bcrypt';
import validator from '../utils/validator.util';
import sessionSvc from '../services/session.service';

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Validation of input data
    const emailValid = validator.email(email);

    if (!emailValid.success) {
      throw { status: emailValid.status };
    }

    const passwordValid = validator.password(password);
    
    if (!passwordValid.success) {
      throw { status: passwordValid.status };
    }

    // User search and password verification
    const user = await prisma.user.findFirst({ where: { email: { equals: email } } });

    if (!user) {
      throw { status: 401 };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw { status: 401 };
    }

    // Create a session
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
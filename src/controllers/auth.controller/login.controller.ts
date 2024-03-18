import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/prisma.config';
import bcrypt from 'bcrypt';
import validator from '../../utils/validator.util';
import sessionSvc from '../../services/session.service';

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Validation of input data
    const emailValid = validator.email(email);
    const passwordValid = validator.password(password);

    if (!emailValid || !passwordValid) {
      throw { status: 400, message: 'Incorrect email or password' };
    }

    // User search and password verification
    const user = await prisma.user.findFirst({ where: { email: email } });

    if (!user) {
      throw { status: 401, message: 'Incorrect email' };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw { status: 401, message: 'Incorrect password' };
    }

    // Create a session
    const createdSession = await sessionSvc.create(user.user_id, res);

    if (!createdSession.success) {
      throw { message: createdSession.message };
    }

    res.status(200).send('Login successful');

  } catch(error) {
    next(error);
  }
}

export default login;
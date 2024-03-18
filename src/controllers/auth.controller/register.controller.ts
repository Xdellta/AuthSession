import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/prisma.config';
import bcrypt from 'bcrypt';
import validator from '../../utils/validator.util';
import tokenScribe from '../../services/tokenScribe.service';
import appCfg from '../../config/app.config';
import mailer from '../../services/mailer.services';
import sessionSvc from '../../services/session.service';

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, repeatPassword } = req.body;

    // Input data validation
    const emailValid = validator.email(email);
    const passwordValid = validator.password(password);

    if (!emailValid || !passwordValid || (password !== repeatPassword)) {
      throw { status: 400, message: 'Invalid input' };
    }

    // Creating user
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date();

    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        activated: false,
        created_at: createdAt
      }
    });

    if (!user) {
      throw { status: 500, message: 'User creation failed' };
    }

    // Sending a verification email
    const createdToken = await tokenScribe(user.user_id, 172800000);

    if (!createdToken.success) {
      throw { message: createdToken.message };
    }

    const activationLink = `${appCfg.protocol}://${appCfg.domain}:${appCfg.port}/api/auth/activate?token=${createdToken.token}`;
    const mailSubject = 'Weryfikacja konta';
    const mailText = `Link do aktywacji konta: ${activationLink}`;
    const mailResult = await mailer(email, mailSubject, mailText);

    if (!mailResult.success) {
      throw { message: mailResult.message };
    }

    // Creating session
    const createdSession = await sessionSvc.create(user.user_id, res);

    if (!createdSession.success) {
      throw { message: createdSession.message };
    }
    
    res.status(200).send('Register successful');

  } catch(error) {
    next(error);
  }
}

export default register;
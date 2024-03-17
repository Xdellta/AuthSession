import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/prisma.config';
import bcrypt from 'bcrypt';
import validator from '../../utils/validator.util';
import sessionSvc from '../../services/session.service';
import mailer from '../../services/mailer.services';

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
        created_at: createdAt
      }
    });

    if (!user) {
      throw { status: 500, message: 'User creation failed' };
    }

    // Sending a verification email
    const mailSubject = 'Weryfikacja konta';
    const mailText = `Link do przywracania hasła: [Link]`;
    const mailResult = await mailer(email, mailSubject, mailText);

    if (!mailResult.success) {
      throw { message: mailResult.message };
    }

    // Creating session
    const session = await sessionSvc.create(user.user_id, res);

    if (!session.success) {
      throw { message: session.message };
    }
    
    res.status(200).send('Register successful');

  } catch(error) {
    next(error);
  }
}

export default register;
import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/prisma.config';

const activate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.query.token as string;

    // Searching for the token in the database
    const foundToken = await prisma.token.findFirst({ where: { token: token } });

    if (!foundToken || foundToken.type !== 'accountActivation') {
      throw { status: 401, message: 'Invalid authorization token' };
    }

    const userId = foundToken.user_id;

    // Deleting the authorization token from the database
    const deletedToken = await prisma.token.delete({ where: { token: token } });

    if (!deletedToken) {
      throw { message: 'Error removing authorization token from the database' };
    }

    // Updating the 'activated' column for the user
    const updateUser = await prisma.user.update({
      where: { user_id: userId },
      data: { activated: true }
    });

    if (!updateUser) {
      throw { message: 'Error updating user activation status in the database' };
    }

    res.status(200).send('Account activated successfully');

  } catch(error) {
    next(error);
  }
}

export default activate;
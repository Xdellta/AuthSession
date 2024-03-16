import prisma from '../../config/prisma.config';
import appCfg from '../../config/app.config';

import { v4 as uuidv4 } from 'uuid';

const refresh = async (session: any) => {
  try {
    if (!session) {
      throw { status: 400, message: 'Session unavailable or does not exist' };
    }

    const newSessionId = uuidv4();
    const newExpires = new Date(Date.now() + appCfg.session.duration);

    const resultRefresh = await prisma.session.update({
      where: { session_id: session.session_id },
      data: {
        session_id: newSessionId,
        expires: newExpires
      }
    });

    if (!resultRefresh) throw { status: 500, message: 'Failed to refresh session' };

    return { success: true };

  } catch(err: any) {
    return { success: false, status: err.status, message: err.message };
  }
}

export default refresh;
import appCfg from '../../config/app.config';

const refresh = async (session: any) => {
  try {
    // Checking if the session exists
    if (!session) {
      throw { status: 400 };
    }

    // Set a new session expiration time
    const sessionDuration = appCfg.session?.duration || 0;
    const newExpires = new Date(Date.now() + sessionDuration);

    // Update the "expires" record in the database
    await session.update({ expires: newExpires });

    return { success: true };

  } catch(error: any) {
    return { success: false, status: error.status || 500 };
  }
}

export default refresh;
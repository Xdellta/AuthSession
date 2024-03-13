import User from '../../models/user.model';
import Session from '../../models/session.model';

const authorize = async (cookieSid: string, reqRoles: string[]) => {
  try {
    if (!cookieSid) {
      throw { status: 400 };
    }

    // Searching and assigning sessions from the database based on ID
    const session = await Session.findOne({ where: { session_id: cookieSid } });

    if (!session) {
      throw { status: 404 };
    }

    if (new Date(session.expires) < new Date()) {
      throw { status: 401 };
    }

    // If reqRoles is provided, check user roles against required roles
    if (reqRoles && reqRoles.length > 0) {
      const user = await User.findOne({ where: { user_id: session.user_id } });

      if (!user) {
        throw { status: 404 };
      }

      const hasPermission = reqRoles.some((role) => user.role.includes(role));

      if (!hasPermission) {
        throw { status: 403 };
      }
    }

    return { success: true, session };

  } catch(error: any) {
    return { success: false, status: error.status || 500 };
  }
}

export default authorize;
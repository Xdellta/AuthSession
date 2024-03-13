import authorize from './session.service/s_authorize.service';
import create from './session.service/s_create.service';
import destroy from './session.service/s_destroy.service';
import refresh from './session.service/s_refresh.service';

const sessionSvc = {
  authorize,
  create,
  destroy,
  refresh
};

export default sessionSvc;
import create from './session.service/s_create.service';
import destroy from './session.service/s_destroy.service';
import refresh from './session.service/s_refresh.service';

const sessionSvc = {
  create,
  destroy,
  refresh
};

export default sessionSvc;
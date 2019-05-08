/**
 * creator:
 * date:
 * description:
 */
import $log from '@lib/log';
// import cling from '@cling_apps'
// const { Member3 } = cling
const log = $log.getInstance('app.Member3');

class Util {
  someApi() {
    log.info('Member3 someApi');
  }
}

export default new Util();

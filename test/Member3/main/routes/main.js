/**
 * acl: admin > member > intern > guest
 *
 * addRoute(method, path, handler, [roles], [check])
 * method: string|array, 'GET' or ['POST', 'PUT']
 * path: string
 * handler: object
 * roles: string|array, 'guest' or ['member', 'admin']
 * check: fucntion
 */
import addRoute from '@lib/addRoute';
import cling from '@cling_apps';

const { Member: { handler, check } } = cling;

export default [
  // get list
  addRoute('GET',
    '/api/v1/Members/{id}/mains',
    handler.main.getList,
    'guest'),
  // read
  addRoute('GET',
    '/api/v1/Members/{id}/mains/{sid}',
    handler.main.read,
    'guest'),
  // create
  addRoute('POST',
    '/api/v1/Members/{id}/mains',
    handler.main.create,
    'member',
    check.main.create),
  // update
  addRoute('PUT',
    '/api/v1/Members/{id}/mains/{sid}',
    handler.main.update,
    'member',
    check.main.update),
  // delete
  addRoute('DELETE',
    '/api/v1/Members/{id}/mains/{sid}',
    handler.main.delete,
    'member',
    check.main.delete)
];

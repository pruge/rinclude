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
    '/api/v1/Members/{id}/hellos',
    handler.hello.getList,
    'guest'),
  // read
  addRoute('GET',
    '/api/v1/Members/{id}/hellos/{sid}',
    handler.hello.read,
    'guest'),
  // create
  addRoute('POST',
    '/api/v1/Members/{id}/hellos',
    handler.hello.create,
    'member',
    check.hello.create),
  // update
  addRoute('PUT',
    '/api/v1/Members/{id}/hellos/{sid}',
    handler.hello.update,
    'member',
    check.hello.update),
  // delete
  addRoute('DELETE',
    '/api/v1/Members/{id}/hellos/{sid}',
    handler.hello.delete,
    'member',
    check.hello.delete)
];

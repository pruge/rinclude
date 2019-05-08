/**
 * creator:
 * date:
 * description:
 */
import $log from '@lib/log'
import Joi from 'joi'
import errors from '@lib/errors'
import cling from '@cling_apps'
// import auth from '@lib/auth'
// import $bus from '@lib/eventbus'
// const { NotFound } = errors
const { Member } = cling
const log = $log.getInstance('app.Member')

export default {
  // auth: 'jwt',
  // pre: [{method: auth('jwt'), assign: 'credentials'}],
  handler: async function (request, h) {
    log.start()
    log.info('--- handler hello delete')

    try {
      await Member.hello.delete(request.pre.ctx)
      return { message: 'Success to delete hello' }
    } catch (err) {
      const boom = errors.getBoom('Member/hello', err)
      log.warn(`Oops, ${boom.message}`)
      throw boom
    }
  },
  validate: {
    // params: {},
    // query: {},
    // payload: {},
    // headers: {}
  },
  response: {
    schema: Joi.object({
      message: Joi.string().required()
      // data: Joi.object().required()
    }).label('Result')
  }
}

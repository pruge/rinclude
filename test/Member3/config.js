const config = {
  name: 'Member3',
  version: '0.0.1',
  active: true,
  required: {},
  page: {
    limit: 10
  },
  event: [
    // 'hello.world', // string
    // {
    //   // object
    //   name: 'hello.world2',
    //   channels: ['ch1']
    // }
  ],
  error: {
    list: [
      // custom
      'TestError'
    ],
    switch: {
      // return Boom
      badRequest: ['TestError']
    }
  }
};

export default config;

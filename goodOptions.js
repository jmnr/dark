module.exports = {
  reporters: [{
    reporter: require('good-http'),
    events: { request: '*' },
    config: {
      endpoint : 'http://localhost:3000/analytics',
      threshold: 0
      // ,wreck: {
      //     headers: { 'x-api-key' : 12345 }
      //     }
    }
  }]
};

'use strict';

const controller = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('my-plugin')
      // the name of the service file & the method.
      .service('service')
      .getWelcomeMessage();
  },
});

module.exports = controller;

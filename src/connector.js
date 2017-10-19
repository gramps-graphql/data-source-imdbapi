import { GraphQLConnector } from '@gramps/gramps-express';

export default class IMDBAPIConnector extends GraphQLConnector {
  /**
   * API for looking up movie info
   * @member {string}
   */
  apiBaseUri = `https://www.theimdbapi.org/api`;
}

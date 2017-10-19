import { GraphQLModel, GrampsError } from '@gramps/gramps-express';

/*
 * For more information on data source models, see
 * https://ibm.biz/graphql-data-source-model
 */

const makeUrlSafe = str => encodeURIComponent(str).replace('%20', '+');
const getQueryString = args =>
  Object.keys(args)
    .map(key => (args[key] ? `${key}=${makeUrlSafe(args[key])}` : false))
    // Remove any arguments that were falsy.
    .filter(pair => pair !== false)
    // Turn the array into a query string.
    .join('&');

export default class IMDBAPIModel extends GraphQLModel {
  /**
   * Searches for a movie by its title and (optionally) its release year.
   *
   * @see http://www.theimdbapi.org/
   * @param  {String}  args.title  movie title to search for
   * @param  {String?} args.year   year the movie was released
   * @return {Promise}             resolves with movie(s) matching the search
   */
  searchMoviesByTitle(args) {
    return this.connector
      .get(`/find/movie?${getQueryString(args)}`)
      .catch(res =>
        this.throwError(res, {
          description: 'Unable to search movies',
          docsLink: 'https://github.com/gramps-express/data-source-imdbapi',
        }),
      );
  }

  /**
   * Searches for a person by their name.
   *
   * A quirk of the IMDB API is that it seems to only return a single result for
   * searches. Bear that in mind when making searches.
   *
   * @see http://www.theimdbapi.org/
   * @param  {String}  name  name to search for
   * @return {Promise}       resolves with person matching the search
   */
  searchPersonByName(name) {
    return this.connector
      .get(`/find/person?${getQueryString({ name })}`)
      .catch(res =>
        this.throwError(res, {
          description: 'Unable to search people',
          docsLink: 'https://github.com/gramps-express/data-source-imdbapi',
        }),
      );
  }

  /**
   * Retrieves a movie by its ID.
   *
   * @see http://www.theimdbapi.org/
   * @param  {String}  movieId  the IMDB movie ID
   * @return {Promise}          resolves with movie matching the ID
   */
  getMovieById(movieId) {
    return this.connector
      .get(`/movie?${getQueryString({ movie_id: movieId })}`)
      .catch(res =>
        this.throwError(res, {
          description: 'Unable to get movie by ID',
          docsLink: 'https://github.com/gramps-express/data-source-imdbapi',
        }),
      );
  }

  /**
   * Retrieves a person by their IMDB ID.
   *
   * @see http://www.theimdbapi.org/
   * @param  {String}  personId  the IMDB person ID
   * @return {Promise}           resolves with person matching the ID
   */
  getPersonById(personId) {
    return this.connector
      .get(`/person?${getQueryString({ person_id: personId })}`)
      .catch(res =>
        this.throwError(res, {
          description: 'Unable to get person by ID',
          docsLink: 'https://github.com/gramps-express/data-source-imdbapi',
        }),
      );
  }

  /**
   * Throws a custom GrAMPS error.
   * @param  {Object}  error            the API error
   * @param  {Object?} customErrorData  additional error data to display
   * @return {void}
   */
  throwError(error, customErrorData = {}) {
    const defaults = {
      statusCode: error.statusCode || 500,
      errorCode: `${this.constructor.name}_Error`,
      description: error.message || 'Something went wrong.',
      targetEndpoint: error.options ? error.options.uri : null,
      graphqlModel: this.constructor.name,
      docsLink: null,
    };

    throw GrampsError({
      ...defaults,
      ...customErrorData,
    });
  }
}

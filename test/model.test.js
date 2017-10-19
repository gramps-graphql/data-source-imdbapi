import { GraphQLModel } from '@gramps/gramps-express';
import Model from '../src/model';
import Connector from '../src/connector';

// Mock the connector because we’re only testing the model here.
jest.mock('../src/connector', () =>
  jest.fn(() => ({
    get: jest.fn(() => Promise.resolve()),
    put: jest.fn(() => Promise.resolve()),
  })),
);

const DATA_SOURCE_NAME = 'IMDBAPI';

const connector = new Connector();
const model = new Model({ connector });

describe(`${DATA_SOURCE_NAME}Model`, () => {
  it('inherits the GraphQLModel class', () => {
    expect(model).toBeInstanceOf(GraphQLModel);
  });

  describe('searchMoviesByTitle()', () => {
    it('calls the correct endpoint with a given ID', () => {
      const spy = jest.spyOn(connector, 'get');

      model.searchMoviesByTitle({ title: 'Test Movie' });
      expect(spy).toHaveBeenCalledWith('/find/movie?title=Test+Movie');
    });

    it('correctly adds the year if one is supplied', () => {
      const spy = jest.spyOn(connector, 'get');

      model.searchMoviesByTitle({ title: 'Test Movie', year: '1979' });
      expect(spy).toHaveBeenCalledWith(
        '/find/movie?title=Test+Movie&year=1979',
      );
    });

    it('ignores the year if an empty value is provided', () => {
      const spy = jest.spyOn(connector, 'get');

      model.searchMoviesByTitle({ title: 'Test Movie', year: '' });
      expect(spy).toHaveBeenCalledWith('/find/movie?title=Test+Movie');
    });

    it('throws a GrampsError if something goes wrong', async () => {
      expect.assertions(3);

      model.connector.get.mockImplementationOnce(() =>
        Promise.reject(Error('boom')),
      );

      try {
        await model.searchMoviesByTitle({ title: 'Test Movie' });
      } catch (error) {
        expect(error.isBoom).toEqual(true);
        expect(error.output.payload.description).toEqual(
          'Unable to search movies',
        );
        expect(error.output.payload.docsLink).toEqual(
          'https://github.com/gramps-express/data-source-imdbapi',
        );
      }
    });
  });

  describe('searchPersonByName()', () => {
    it('calls the correct endpoint with a given ID', () => {
      const spy = jest.spyOn(connector, 'get');

      model.searchPersonByName('Famous Person');
      expect(spy).toHaveBeenCalledWith('/find/person?name=Famous+Person');
    });

    it('throws a GrampsError if something goes wrong', async () => {
      expect.assertions(3);

      model.connector.get.mockImplementationOnce(() =>
        Promise.reject(Error('boom')),
      );

      try {
        await model.searchPersonByName('Famous Person');
      } catch (error) {
        expect(error.isBoom).toEqual(true);
        expect(error.output.payload.description).toEqual(
          'Unable to search people',
        );
        expect(error.output.payload.docsLink).toEqual(
          'https://github.com/gramps-express/data-source-imdbapi',
        );
      }
    });
  });

  describe('getMovieById()', () => {
    it('calls the correct endpoint with a given ID', () => {
      const spy = jest.spyOn(connector, 'get');

      model.getMovieById('tt1234567');
      expect(spy).toHaveBeenCalledWith('/movie?movie_id=tt1234567');
    });

    it('throws a GrampsError if something goes wrong', async () => {
      expect.assertions(3);

      model.connector.get.mockImplementationOnce(() =>
        Promise.reject(Error('boom')),
      );

      try {
        await model.getMovieById('tt1234567');
      } catch (error) {
        expect(error.isBoom).toEqual(true);
        expect(error.output.payload.description).toEqual(
          'Unable to get movie by ID',
        );
        expect(error.output.payload.docsLink).toEqual(
          'https://github.com/gramps-express/data-source-imdbapi',
        );
      }
    });
  });

  describe('getPersonById()', () => {
    it('calls the correct endpoint with a given ID', () => {
      const spy = jest.spyOn(connector, 'get');

      model.getPersonById('nm1234567');
      expect(spy).toHaveBeenCalledWith('/person?person_id=nm1234567');
    });

    it('throws a GrampsError if something goes wrong', async () => {
      expect.assertions(3);

      model.connector.get.mockImplementationOnce(() =>
        Promise.reject(Error('boom')),
      );

      try {
        await model.getPersonById('nm1234567');
      } catch (error) {
        expect(error.isBoom).toEqual(true);
        expect(error.output.payload.description).toEqual(
          'Unable to get person by ID',
        );
        expect(error.output.payload.docsLink).toEqual(
          'https://github.com/gramps-express/data-source-imdbapi',
        );
      }
    });
  });

  describe('throwError()', () => {
    const mockError = {
      statusCode: 401,
      options: {
        uri: 'https://example.org/',
      },
    };

    it('converts an error from the endpoint into a GrampsError', async () => {
      expect.assertions(4);

      /*
       * To simulate a failed call, we tell Jest to return a rejected Promise
       * with our mock error.
       */
      model.connector.get.mockImplementationOnce(() =>
        Promise.reject(mockError),
      );

      try {
        await model.searchMoviesByTitle({ title: 'Test Movie' });
      } catch (error) {
        // Check that GrampsError properly received the error detail.
        expect(error).toHaveProperty('isBoom', true);
        expect(error.output).toHaveProperty('statusCode', 401);
        expect(error.output.payload).toHaveProperty(
          'targetEndpoint',
          'https://example.org/',
        );
        expect(error.output.payload).toHaveProperty(
          'graphqlModel',
          `${DATA_SOURCE_NAME}Model`,
        );
      }
    });

    it('creates a default GrampsError if no custom error data is supplied', async () => {
      try {
        await model.throwError({});
      } catch (error) {
        expect(error.output.statusCode).toBe(500);
        expect(error.output.payload.errorCode).toBe(
          `${DATA_SOURCE_NAME}Model_Error`,
        );
        expect(error.output.payload.description).toBe('Something went wrong.');
        expect(error.output.payload.graphqlModel).toBe(
          `${DATA_SOURCE_NAME}Model`,
        );
        expect(error.output.payload.targetEndpoint).toBeNull();
      }
    });
  });
});

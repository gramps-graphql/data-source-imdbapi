import resolvers from '../src/resolvers';
import expectMockFields from './helpers/expectMockFields';
import expectMockList from './helpers/expectMockList';
// import expectNullable from './helpers/expectNullable';

describe(`IMDBAPI resolvers`, () => {
  it('returns valid resolvers', () => {
    expect(Object.keys(resolvers)).toEqual([
      'queryResolvers',
      'dataResolvers',
      'mockResolvers',
    ]);
  });

  describe('queryResolvers', () => {
    const mockContext = {
      IMDBAPI: {
        searchMoviesByTitle: queryArgs => Promise.resolve(queryArgs),
        searchPersonByName: queryArgs => Promise.resolve(queryArgs),
        getMovieById: queryArgs => Promise.resolve(queryArgs),
        getPersonById: queryArgs => Promise.resolve(queryArgs),
      },
    };

    describe('searchMoviesByTitle()', () => {
      it('searches for movies by their titles', async () => {
        expect.assertions(1);

        const args = { options: { title: 'Test Movie' } };
        const response = await resolvers.queryResolvers.searchMoviesByTitle(
          null,
          args,
          mockContext,
        );

        return expect(response).toEqual({ title: 'Test Movie' });
      });
    });

    describe('getMovieById()', () => {
      it('loads a movie by its IMDB ID', async () => {
        expect.assertions(1);

        const args = { movie_id: 'tt1234567' };
        const response = await resolvers.queryResolvers.getMovieById(
          null,
          args,
          mockContext,
        );

        return expect(response).toEqual('tt1234567');
      });
    });

    describe('searchPersonByName()', () => {
      it('searches for people by their names', async () => {
        expect.assertions(1);

        const args = { name: 'Famous Person' };
        const response = await resolvers.queryResolvers.searchPersonByName(
          null,
          args,
          mockContext,
        );

        return expect(response).toEqual('Famous Person');
      });
    });

    describe('getPersonById()', () => {
      it('loads a person by their IMDB ID', async () => {
        expect.assertions(1);

        const args = { person_id: 'nm1234567' };
        const response = await resolvers.queryResolvers.getPersonById(
          null,
          args,
          mockContext,
        );

        return expect(response).toEqual('nm1234567');
      });
    });
  });

  describe('dataResolvers', () => {
    describe('IMDB_Person', () => {
      const resolver = resolvers.dataResolvers.IMDB_Person;
      const mockData = {
        filmography: {
          actor: [
            {
              imdb_id: 'tt1234567',
              title: 'Work One',
              type: 'Film',
              url: 'http://workone.org/',
              year: '1999',
            },
          ],
          director: [
            {
              imdb_id: 'tt7654321',
              title: 'Work Two',
              type: 'TV Series',
              url: 'http://worktwo.org/',
              year: '1985',
            },
          ],
        },
      };

      it('converts the filmography object into an array', () => {
        expect(resolver.filmography(mockData, {})).toEqual([
          {
            position: 'actor',
            imdb_id: 'tt1234567',
            title: 'Work One',
            type: 'Film',
            url: 'http://workone.org/',
            year: '1999',
          },
          {
            position: 'director',
            imdb_id: 'tt7654321',
            title: 'Work Two',
            type: 'TV Series',
            url: 'http://worktwo.org/',
            year: '1985',
          },
        ]);
      });

      it('filters the filmography entries', () => {
        expect(resolver.filmography(mockData, { filter: 'actor' })).toEqual([
          {
            position: 'actor',
            imdb_id: 'tt1234567',
            title: 'Work One',
            type: 'Film',
            url: 'http://workone.org/',
            year: '1999',
          },
        ]);
      });
    });

    describe('IMDB_Metadata', () => {
      const resolver = resolvers.dataResolvers.IMDB_Metadata;

      it('fixes the typo for the aspect ratio', () => {
        expect(resolver.asp_ratio({ asp_retio: '16 : 9' })).toEqual('16 : 9');
      });
    });
  });

  describe('mockResolvers', () => {
    /*
     * So, basically mock resolvers just need to return values without
     * exploding. To that end, we’ll just check that the mock response returns
     * the proper fields.
     */
    describe('IMDB_Movie', () => {
      const mockResolvers = resolvers.mockResolvers.IMDB_Movie();

      it('mocks the genre', () => {
        expect(
          ['Action', 'Drama', 'Comedy'].includes(
            mockResolvers.genre().wrappedFunction(),
          ),
        ).toBe(true);
      });

      it('mocks the stars', () => {
        expect(mockResolvers.stars().wrappedFunction()).toBeDefined();
      });

      it('mocks the writers', () => {
        expect(mockResolvers.writers().wrappedFunction()).toBeDefined();
      });

      expectMockFields(mockResolvers, [
        'cast',
        'content_rating',
        'description',
        'director',
        'genre',
        'imdb_id',
        'length',
        'original_title',
        'rating',
        'rating_count',
        'release_date',
        'stars',
        'storyline',
        'title',
        'trailer',
        'writers',
        'year',
      ]);

      expectMockList(mockResolvers, [
        'cast',
        'genre',
        'stars',
        'trailer',
        'writers',
      ]);
    });

    describe('IMDB_Cast', () => {
      const mockResolvers = resolvers.mockResolvers.IMDB_Cast();

      expectMockFields(mockResolvers, ['character', 'image', 'link', 'name']);
    });

    describe('IMDB_Metadata', () => {
      const mockResolvers = resolvers.mockResolvers.IMDB_Metadata();

      it('mocks the countries', () => {
        expect(mockResolvers.countries().wrappedFunction()).toBeDefined();
      });

      it('mocks the filming_locations', () => {
        expect(
          mockResolvers.filming_locations().wrappedFunction(),
        ).toBeDefined();
      });

      it('mocks the languages', () => {
        expect(
          ['English', 'Spanish'].includes(
            mockResolvers.languages().wrappedFunction(),
          ),
        ).toBe(true);
      });

      it('mocks the sound_mix', () => {
        expect(
          ['Auro 11.1', 'Dolby Digital', 'Dolby Surround 7.1'].includes(
            mockResolvers.sound_mix().wrappedFunction(),
          ),
        ).toBe(true);
      });

      expectMockFields(mockResolvers, [
        'also_known_as',
        'asp_ratio',
        'budget',
        'countries',
        'filming_locations',
        'gross',
        'languages',
        'sound_mix',
      ]);

      expectMockList(mockResolvers, [
        'countries',
        'filming_locations',
        'languages',
        'sound_mix',
      ]);
    });

    describe('IMDB_Poster', () => {
      const mockResolvers = resolvers.mockResolvers.IMDB_Poster();

      expectMockFields(mockResolvers, ['large', 'thumb']);
    });

    describe('IMDB_Trailer', () => {
      const mockResolvers = resolvers.mockResolvers.IMDB_Trailer();

      expectMockFields(mockResolvers, ['definition', 'mimeType', 'videoUrl']);
    });

    describe('IMDB_Url', () => {
      const mockResolvers = resolvers.mockResolvers.IMDB_Url();

      expectMockFields(mockResolvers, ['title', 'url', 'year']);
    });

    describe('IMDB_Person', () => {
      const mockResolvers = resolvers.mockResolvers.IMDB_Person();

      it('mocks the type', () => {
        expect(
          ['Actor', 'Writer', 'Producer'].includes(
            mockResolvers.type().wrappedFunction(),
          ),
        ).toBe(true);
      });

      expectMockFields(mockResolvers, [
        'birthday',
        'birthplace',
        'description',
        'filmography',
        'person_id',
        'photos',
        'title',
        'type',
      ]);

      expectMockList(mockResolvers, ['filmography', 'type']);
    });

    describe('IMDB_Filmography', () => {
      const mockResolvers = resolvers.mockResolvers.IMDB_Filmography();

      expectMockFields(mockResolvers, [
        'position',
        'imdb_id',
        'title',
        'type',
        'url',
        'year',
      ]);
    });

    describe('IMDB_PersonImage', () => {
      const mockResolvers = resolvers.mockResolvers.IMDB_PersonImage();

      expectMockFields(mockResolvers, ['poster', 'thumb']);
    });
  });
});

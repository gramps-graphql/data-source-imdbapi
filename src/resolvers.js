import { MockList } from 'graphql-tools';
import casual from 'casual';

export default {
  queryResolvers: {
    searchMoviesByTitle: (_, { options }, context) =>
      new Promise((resolve, reject) => {
        context.IMDBAPI
          .searchMoviesByTitle(options)
          .then(resolve)
          .catch(reject);
      }),
    getMovieById: (_, { movie_id }, context) =>
      new Promise((resolve, reject) => {
        context.IMDBAPI
          .getMovieById(movie_id)
          .then(resolve)
          .catch(reject);
      }),
    searchPersonByName: (_, { name }, context) =>
      new Promise((resolve, reject) => {
        context.IMDBAPI
          .searchPersonByName(name)
          .then(resolve)
          .catch(reject);
      }),
    getPersonById: (_, { person_id }, context) =>
      new Promise((resolve, reject) => {
        context.IMDBAPI
          .getPersonById(person_id)
          .then(resolve)
          .catch(reject);
      }),
  },

  dataResolvers: {
    IMDB_Person: {
      // Convert the filmography object into an array for filtering/typing.
      filmography: ({ filmography }, { filter = 'all' }) =>
        Object.keys(filmography)
          .reduce(
            (works, position) =>
              works.concat(
                filmography[position].map(work => ({
                  position,
                  imdb_id: work.imdb_id,
                  title: work.title,
                  type: work.type,
                  url: work.url,
                  year: work.year,
                })),
              ),
            [],
          )
          .filter(work => filter === 'all' || work.position === filter),
    },
    IMDB_Metadata: {
      // Alias this field to fix a typo.
      asp_ratio: data => data.asp_retio,
    },
  },

  mockResolvers: {
    IMDB_Movie: () => ({
      cast: () => new MockList([1, 10]),
      content_rating: casual.random_element(['PG', 'R', 'PG-13']),
      description: casual.sentences(2),
      director: casual.name,
      genre: () =>
        new MockList([1, 3], () =>
          casual.random_element(['Action', 'Drama', 'Comedy']),
        ),
      imdb_id: `tt${Math.round(10000000 * Math.random())}`,
      length: `${casual.integer(75, 190)}`,
      original_title: casual.title,
      rating: casual.integer(0, 100) / 10,
      rating_count: casual.integer(0, 300),
      release_date: casual.date('YYYY-MM-DD'),
      stars: () => new MockList([1, 4], () => casual.name),
      storyline: casual.sentences(2),
      title: casual.title,
      trailer: () => new MockList([1, 3]),
      writers: () => new MockList([1, 4], () => casual.name),
      year: casual.year,
    }),
    IMDB_Cast: () => ({
      character: casual.name,
      image:
        'https://images-na.ssl-images-amazon.com/images/M/MV5BMTU1MzE4MjAzMV5BMl5BanBnXkFtZTcwMjA2MTMyMw@@._V1_UY44_CR0,0,32,44_AL_.jpg',
      link: 'http://www.imdb.com/name/nm0001804/?ref_=tt_cl_t1',
      name: casual.name,
    }),
    IMDB_Metadata: () => ({
      also_known_as: [casual.title],
      asp_ratio: '16 : 9',
      budget: casual
        .integer(900000, 15000000)
        .toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      countries: () => new MockList([1, 4], () => casual.country),
      filming_locations: () => new MockList([1, 4], () => casual.city),
      gross: casual
        .integer(1000000, 50000000)
        .toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      languages: () =>
        new MockList([1, 4], () =>
          casual.random_element(['English', 'Spanish']),
        ),
      sound_mix: () =>
        new MockList([1, 3], () =>
          casual.random_element([
            'Auro 11.1',
            'Dolby Digital',
            'Dolby Surround 7.1',
          ]),
        ),
    }),
    IMDB_Poster: () => ({
      large:
        'https://images-na.ssl-images-amazon.com/images/M/MV5BMjA4NDg3NzYxMF5BMl5BanBnXkFtZTcwNTgyNzkyNw@@._V1_.jpg',
      thumb:
        'https://images-na.ssl-images-amazon.com/images/M/MV5BMjA4NDg3NzYxMF5BMl5BanBnXkFtZTcwNTgyNzkyNw@@._V1_UX182_CR0,0,182,268_AL_.jpg',
    }),
    IMDB_Trailer: () => ({
      definition: casual.random_element([
        'SD',
        'auto',
        '480p',
        '720p',
        '1080p',
      ]),
      mimeType: casual.mime_type,
      videoUrl:
        'https://video-http.media-imdb.com/MV5BOWQzZjQyZDctNDYzOS00ZjQyLTg4NWItMWQwNjg1YmMzZjdjXkExMV5BbXA0XkFpbWRiLWV0cy10cmFuc2NvZGU@.mp4?Expires=1508520493&Signature=MEPmF1uuC-4WaQhu3P4xei~pr3qKihmacZmPbPxl4Iaj~GO9jBHYOiMZHvrnOSedLS8VQscLBYr-61ubSsbr3aomM7VYqymKLGHHcE4tMO71oM8oB6QHBu3gHh~D~HWNrfkCMrdIGai3GRzVsZX4KcoC8oOvstOn2sBh-YlAQQM_&Key-Pair-Id=APKAILW5I44IHKUN2DYA',
    }),
    IMDB_Url: () => ({
      title: casual.title,
      url: casual.url,
      year: casual.year,
    }),
    IMDB_Person: () => ({
      birthday: casual.date('YYYY-MM-DD'),
      birthplace: `${casual.city}, ${casual.state}, ${casual.country}`,
      description: casual.sentences(2),
      filmography: () => new MockList([1, 5]),
      person_id: `nm${Math.round(10000000 * Math.random())}`,
      photos: [
        'https://images-na.ssl-images-amazon.com/images/M/MV5BMzA2ODY4MTQ5N15BMl5BanBnXkFtZTgwNTI0NzU5MDE@._V1_SY1000_CR0,0,666,1000_AL_.jpg',
        'https://images-na.ssl-images-amazon.com/images/M/MV5BMTQxNTY4MTc0MV5BMl5BanBnXkFtZTcwMDQ2MTY5Mg@@._V1_SY1000_CR0,0,666,1000_AL_.jpg',
      ],
      title: casual.name,
      type: () =>
        new MockList([1, 3], () =>
          casual.random_element(['Actor', 'Writer', 'Producer']),
        ),
    }),
    IMDB_Filmography: () => ({
      position: casual.random_element(['actor', 'writer', 'producer', 'self']),
      imdb_id: `tt${Math.round(10000000 * Math.random())}`,
      title: casual.title,
      type: casual.random_element(['TV Series', 'Film']),
      url: casual.url,
      year: casual.year,
    }),
    IMDB_PersonImage: () => ({
      poster:
        'https://images-na.ssl-images-amazon.com/images/M/MV5BMTQwMjAwNzI0M15BMl5BanBnXkFtZTcwOTY1MTMyOQ@@._V1_UY1200_CR173,0,630,1200_AL_.jpg',
      thumb:
        'https://images-na.ssl-images-amazon.com/images/M/MV5BMTQwMjAwNzI0M15BMl5BanBnXkFtZTcwOTY1MTMyOQ@@._V1_UY317_CR22,0,214,317_AL_.jpg',
    }),
  },
};

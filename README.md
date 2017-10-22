<a href="https://ibm.biz/gramps-graphql"><img src="https://gramps-graphql.github.io/gramps-express/assets/img/gramps-banner.png" alt="GrAMPS · An easier way to manage the data sources powering your GraphQL server" width="450"></a>

# GrAMPS GraphQL Data Source for the [IMDB API](http://www.theimdbapi.org/)
[![license](https://img.shields.io/npm/l/@gramps/data-source-imdbapi.svg)](https://github.com/gramps-graphql/data-source-imdbapi/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/@gramps/data-source-imdbapi.svg?style=flat)](https://www.npmjs.com/package/@gramps/data-source-imdbapi) [![Build Status](https://travis-ci.org/gramps-graphql/data-source-imdbapi.svg?branch=master)](https://travis-ci.org/gramps-graphql/data-source-imdbapi) [![Maintainability](https://api.codeclimate.com/v1/badges/ac264833fac1fbd1afe0/maintainability)](https://codeclimate.com/github/gramps-graphql/data-source-imdbapi/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/ac264833fac1fbd1afe0/test_coverage)](https://codeclimate.com/github/gramps-graphql/data-source-imdbapi/test_coverage) [![Greenkeeper badge](https://badges.greenkeeper.io/gramps-graphql/data-source-imdbapi.svg)](https://greenkeeper.io/)

Look up trailers, ratings, and other information about movies from the [IMDB API](http://www.theimdbapi.org/).

This is a [GrAMPS](https://ibm.biz/gramps-graphql) data source for GraphQL.

## Example Queries

TKTK

## Quickstart

**NOTE:** Replace all instances of `YOUR_DATA_SOURCE_NAME` with the actual name you want to use (e.g. `data-source-companyname-datatype`).

```sh
# Clone the repo
git clone git@github.com:gramps-graphql/data-source-imdbapi.git data-source-YOUR_DATA_SOURCE_NAME

# Move into it
cd data-source-imdbapi/

# Install dependencies
yarn install
```

### To Develop with Mock Data

Start the app with the following command:

```sh
# Develop with mock data
yarn mock-data
```

### To Develop with Live Data

Once you’ve got your data source configured to load live data, you can enable live data in development:

```sh
# Develop with live data
yarn live-data
```

### Notes for Developers

Currently, there is no watch capability (PRs welcome!), so the service needs to be stopped (`control` + `C`) and restarted (`yarn [mock-data|live-data]`) to reflect new changes to the data source.

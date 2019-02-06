## Setup

```
$ yarn install
```

* Travis: set environment variable `CYPRESS_DHIS2_AUTH=admin:PASSWORD`.

## Development

Start development server:

```
$ yarn start
```

This will open the development server at port 8081 and will connect to DHIS 2 instance http://localhost:8080.

Use custom values passing environment variables. An example:

```
$ PORT=8082 REACT_APP_DHIS2_URL="http://localhost:8080/" yarn start
```

## Tests

Unit tests:

```
$ yarn test
```

Integration tests:

```
$ export CYPRESS_DHIS2_AUTH='admin:district'
$ export CYPRESS_EXTERNAL_API="http://localhost:8080"
$ export CYPRESS_ROOT_URL=http://localhost:8081

$ yarn cy:e2e:run # non-interactive
$ yarn cy:e2e:open # interactive UI
```

## Build

```
$ yarn build-webapp
```

## i18n

### Update an existing language

```
$ yarn update-po
# ... add/edit translations in po files ...
$ yarn localize
```

### Create a new language

```
$ cp i18n/en.pot i18n/es.po
# ... add translations to i18n/es.po ...
$ yarn localize
```

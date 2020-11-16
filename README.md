# ebbtide

## Todo

- I18N

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production

First, edit `src/config.js` to suit your lotide api path. 

By default, ebbtide has a base url of `https://your.domain/main/`. If you want to get rid of the `/main/` part or change it into something else, please edit the `package.json` accordingly: 

```
  "vue": {
    "publicPath": "/thePathYouWant"
  },
```

To build, run:

```
yarn build
```

The built files are under the `dist/` folder.

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### License
Licensed under AGPL-3.0

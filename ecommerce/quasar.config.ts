
import { defineConfig } from '#q-app/wrappers';

export default defineConfig((/* ctx */) => {
  return {
    boot: ['axios'],

    css: ['app.scss'],
    extras: [

      'roboto-font', 
      'material-icons', 
    ],
    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20',
      },

      typescript: {
        strict: true,
        vueShim: true,
      },

      vueRouterMode: 'hash', 

      vitePlugins: [
        [
          'vite-plugin-checker',
          {
            vueTsc: true,
          },
          { server: false },
        ],
      ],
    },

    devServer: {
      open: true,
    },

    framework: {
      config: {},
      plugins: [
        'Dialog',
        'Dark',
        'Notify'
      ],
    },

    animations: [],
    ssr: {
      prodPort: 3000, 

      middlewares: [
        'render',
      ],


      pwa: false,
    },

    pwa: {
      workboxMode: 'GenerateSW', 
    },

    cordova: {
    },
    capacitor: {
      hideSplashscreen: true,
    },

    electron: {
      preloadScripts: ['electron-preload'],
      inspectPort: 5858,

      bundler: 'packager', 

      packager: {
      },

      builder: {

        appId: 'dba-ecommerce',
      },
    },

    bex: {
      /**
       * The list of extra scripts (js/ts) not in your bex manifest that you want to
       * compile and use in your browser extension. Maybe dynamic use them?
       *
       * Each entry in the list should be a relative filename to /src-bex/
       *
       * @example
       */
      extraScripts: [],
    },
  };
});

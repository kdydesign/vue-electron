const { join } = require('path')
const {
  sortDependencies,
  installDependencies,
  runLintFix,
  printMessage
} = require('./utils')

module.exports = {
  prompts: {
    name: {
      type: 'string',
      required: true,
      message: 'Application Name',
      default: 'your-app'
    },
    appid: {
      type: 'string',
      required: true,
      message: 'Application Id',
      default: 'com.example.yourapp'
    },
    appver: {
      type: 'string',
      required: true,
      message: 'Application Version',
      default: '0.0.1'
    },
    description: {
      type: 'string',
      required: false,
      message: 'Project description',
      default: 'An electron-vue project'
    },
    csspreprocessor: {
      type: 'list',
      message: 'Select CSS Pre-Processor',
      choices: [
        {
          name: 'Sass',
          value: 'sass'
        },
        {
          name: 'Less',
          value: 'less'
        },
        {
          name: 'Stylus',
          value: 'stylus'
        },
        {
          name: 'None',
          value: 'none'
        }
      ]
    },
    plugins: {
      type: 'checkbox',
      message: 'Select which Vue plugins to install',
      choices: ['axios', 'vue-electron', 'vue-router', 'vuex', 'vuex-electron'],
      default: ['axios', 'vue-electron', 'vue-router', 'vuex', 'vuex-electron']
    },
    framework: {
      type: 'list',
      message: 'Select UI framework package to install',
      choices: [
        {
          name: 'Vuetify',
          value: 'vuetify'
        },
        {
          name: 'Quasar',
          value: 'quasar'
        },
        {
          name: 'None',
          value: 'none'
        }
      ]
    },
    eslint: {
      type: 'confirm',
      require: true,
      message: 'Use linting with ESLint?',
      default: true
    },
    eslintConfig: {
      when: 'eslint',
      type: 'list',
      message: 'Which ESLint config would you like to use?',
      choices: [
        {
          name: 'Standard (https://github.com/feross/standard)',
          value: 'standard',
          short: 'Standard'
        },
        {
          name: 'Airbnb (https://github.com/airbnb/javascript)',
          value: 'airbnb',
          short: 'Airbnb'
        },
        {
          name: 'none (configure it yourself)',
          value: 'none',
          short: 'none'
        }
      ]
    },
    unit: {
      type: 'confirm',
      message: 'Set up unit testing with Karma + Mocha?',
      required: true
    },
    e2e: {
      type: 'confirm',
      message: 'Set up end-to-end testing with Spectron + Mocha?',
      require: true
    },
    builder: {
      type: 'list',
      message: 'What build tool would you like to use?',
      choices: [
        {
          name: 'electron-builder (https://github.com/electron-userland/electron-builder)',
          value: 'builder',
          short: 'builder'
        },
        {
          name: 'electron-packager (https://github.com/electron-userland/electron-packager)',
          value: 'packager',
          short: 'packager'
        }
      ]
    },
    autoInstall: {
      type: 'list',
      message:
        'Should we run `npm install` for you after the project has been created? (recommended)',
      choices: [
        {
          name: 'Yes, use NPM',
          value: 'npm',
          short: 'npm'
        },
        {
          name: 'Yes, use Yarn',
          value: 'yarn',
          short: 'yarn'
        },
        {
          name: 'No, I will handle that myself',
          value: false,
          short: 'no'
        }
      ]
    }
  },
  helpers: {
    isEnabled (list, check, opts) {
      if (list[check] || list === check) {
        return opts.fn(this)
      } else {
        return opts.inverse(this)
      }
    },
    deps (plugins) {
      let output = ''
      const dependencies = {
        axios: '^0.19.0',
        'vue-electron': '^1.0.6',
        'vue-router': '^3.1.3',
        vuex: '^3.1.2',
        'vuex-electron': '^1.0.3'
      }

      if (Object.keys(plugins).length > 0) output += ',\n'

      Object.keys(plugins).forEach((p, i) => {
        output += `    "${p}": "${dependencies[p]}"`
        if (i !== Object.keys(plugins).length - 1) output += ',\n'
      })

      return output
    },
    depsf (framework) {
      let output = ''

      switch (framework) {
        case 'vuetify':
          output = ', \n    "vuetify": "^2.1.15"'
          break
        case 'quasar':
          output = ', \n    "quasar": "^1.5.11"'
          break
      }

      return output
    },
    testing (unit, e2e, opts) {
      if (unit || e2e) {
        return opts.fn(this)
      }
    }
  },
  filters: {
    'src/renderer/routes.js': 'plugins[\'vue-router\']',
    'src/renderer/components/LandingPageView/CurrentPage.vue': 'plugins[\'vue-router\']',
    'src/renderer/router/**/*': 'plugins[\'vue-router\']',
    'src/renderer/store/**/*': 'plugins[\'vuex\']',
    'test/e2e/**/*': 'e2e',
    'test/unit/**/*': 'unit',
    '.electron-vue/build.config.js': 'builder === \'packager\'',
    'test/.eslintrc': 'e2e || unit',
    '.eslintignore': 'eslint',
    '.eslintrc.js': 'eslint',
    'appveyor.yml': 'builder === \'builder\'',
    '.travis.yml': 'builder === \'builder\''
  },
  complete (data, { chalk }) {
    const green = chalk.green

    sortDependencies(data, green)

    const cwd = join(process.cwd(), data.inPlace ? '' : data.destDirName)

    if (data.autoInstall) {
      installDependencies(cwd, data.autoInstall, green)
        .then(() => {
          return runLintFix(cwd, data, green)
        }).then(() => {
          printMessage(data, green)
        }).catch(e => {
          console.log(chalk.red('Error:'), e)
        })
    } else {
      printMessage(data, chalk)
    }
  }
}

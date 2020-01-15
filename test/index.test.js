const data = {
  destDirName: 've4',
  inPlace: false,
  noEscape: true,
  name: 've4',
  appid: 'com.example.yourapp',
  appver: '0.0.1',
  description: 'An electron-vue project',
  csspreprocessor: 'sass',
  plugins: {
    axios: true,
    'vue-electron': true,
    'vue-router': true,
    vuex: true,
    'vuex-electron': true
  },
  framework: 'vuetify',
  eslint: true,
  eslintConfig: 'standard',
  unit: true,
  e2e: true,
  builder: 'builder',
  autoInstall: 'npm',
  author: 'kdydesign <kdydesign@gmail.com>'
}

describe('utils', () => {
  test('true', () => {
    expect(data).toHaveProperty('destDirName')
  })
})

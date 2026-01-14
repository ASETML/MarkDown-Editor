const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    //Win
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    //All Plateform
    {
      name: '@electron-forge/maker-zip',
    },
    //Debian
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          maintainer: 'ASETML',
          homepage: 'https://github.com/ASETML/MarkDown-Editor'
        }
      }
    },
    //Red Hat
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          homepage: 'https://github.com/ASETML/MarkDown-Editor'
        }
      }
    },
    //Win Portable
    {
      "name": "@rabbitholesyndrome/electron-forge-maker-portable",
      config: {}
    },
    //MacOS
    {
      name: '@electron-forge/maker-dmg',
      config: {
        background: './assets/dmg-background.png',
        format: 'ULFO'
      }
    }

  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

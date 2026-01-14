const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    //icon: "client/images/MarkDownEditor-logo"
  },
  rebuildConfig: {},
  makers: [
    //Win
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        //iconUrl: "client/images/MarkDownEditor-logo.png",
        //setupIcon: "client/images/MarkDownEditor-logo.png"
      },
    },
    //Debian
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          maintainer: 'ASETML',
          homepage: 'https://github.com/ASETML/MarkDown-Editor',
          //icon: "client/images/MarkDownEditor-logo.png"
        }
      }
    },
    //Red Hat
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          homepage: 'https://github.com/ASETML/MarkDown-Editor',
          //icon: "client/images/MarkDownEditor-logo.png"
        }
      }
    },
    //Win Portable
    {
      "name": "@rabbitholesyndrome/electron-forge-maker-portable",
      config: {
        //icon: "client/images/MarkDownEditor-logo.png"
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

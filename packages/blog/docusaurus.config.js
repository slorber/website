/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const theme = require('lib-react/prism-theme.json');

module.exports = {
  title: 'Blog',
  tagline: 'Developer Sam Blog',
  url: 'https://blog.developersam.com',
  organizationName: 'SamChou19815',
  projectName: 'website',
  baseUrl: '/',
  favicon: 'https://developersam.com/favicon.ico',
  themeConfig: {
    colorMode: {
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    prism: { theme },
    navbar: {
      title: 'Developer Sam Blog',
      items: [
        {
          href: 'https://developersam.com/',
          label: 'Main Site',
          position: 'right',
        },
        {
          href: 'https://github.com/SamChou19815',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © 2016-${new Date().getFullYear()} Developer Sam.`,
    },
    googleAnalytics: { trackingID: 'UA-140662756-1' },
    gtag: { trackingID: 'UA-140662756-1' },
  },
  themes: [
    [
      require.resolve('@docusaurus/theme-classic'),
      { customCss: require.resolve('./src/css/custom.css') },
    ],
  ],
  plugins: [
    require.resolve('lib-docusaurus-plugin'),
    [
      require.resolve('@docusaurus/plugin-content-blog'),
      {
        path: './blog',
        routeBasePath: '/',
        editUrl: 'https://github.com/SamChou19815/website/edit/master/packages/blog/',
        feedOptions: {
          type: 'all',
          copyright: `Copyright © ${new Date().getFullYear()} Developer Sam.`,
        },
      },
    ],
    process.env.NODE_ENV === 'production' && [
      require.resolve('@docusaurus/plugin-sitemap'),
      {
        cacheTime: 600 * 1000,
        changefreq: 'weekly',
        priority: 0.5,
      },
    ],
    process.env.NODE_ENV === 'production' && require.resolve('@docusaurus/plugin-google-gtag'),
  ].filter(Boolean),
};

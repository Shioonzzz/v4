// gatsby-config.js - Updated configuration for bot integration
const config = require('./src/config');

module.exports = {
  siteMetadata: {
    title: config.siteTitle,
    description: config.siteDescription,
    siteUrl: config.siteUrl,
    author: config.name,
    // Add bot-specific metadata
    botTitle: 'Smart Financial Analyzer',
    botDescription: 'AI-powered financial analysis with 3D visualization',
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: config.siteTitle,
        short_name: config.siteTitle,
        start_url: `/`,
        background_color: config.colors.darkNavy,
        theme_color: config.colors.navy,
        display: `minimal-ui`,
        icon: `src/images/logo.png`,
      },
    },
    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/content/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/content/posts`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `projects`,
        path: `${__dirname}/content/projects`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-external-links`,
            options: {
              target: `_blank`,
              rel: `noreferrer noopener`,
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 700,
              linkImagesToOriginal: true,
              quality: 90,
              tracedSVG: { color: config.colors.green },
            },
          },
          {
            resolve: `gatsby-remark-code-titles`,
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
              languageExtensions: [
                {
                  language: 'superscript',
                  extend: 'javascript',
                  definition: {
                    superscript_types: /(SuperType)/,
                  },
                  insertBefore: {
                    function: {
                      superscript_keywords: /(superif|superelse)/,
                    },
                  },
                },
              ],
              prompt: {
                user: 'root',
                host: 'localhost',
                global: false,
              },
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: config.googleAnalyticsID,
      },
    },
    // Add support for Three.js and WebGL
    {
      resolve: 'gatsby-plugin-webpack-bundle-analyser-v2',
      options: {
        devMode: false,
      },
    },
    // PWA capabilities for the bot
    {
      resolve: `gatsby-plugin-pwa`,
      options: {
        name: config.siteTitle,
        short_name: config.siteTitle,
        start_url: `/`,
        background_color: config.colors.darkNavy,
        theme_color: config.colors.navy,
        display: `standalone`,
        icon: `src/images/logo.png`,
        cache_busting_mode: 'none',
        include: [`/static/**/*`],
        exclude: [`/financial-analyzer/**/*`], // Don't cache bot pages for real-time data
      },
    },
    // SEO optimization
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: config.siteUrl,
        sitemap: `${config.siteUrl}/sitemap.xml`,
        policy: [
          {
            userAgent: '*',
            allow: '/',
            disallow: ['/financial-analyzer/admin'], // Protect admin areas
          },
        ],
      },
    },
    // Sitemap generation
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        exclude: [`/financial-analyzer/admin/**`, `/dev-404-page/`],
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            allSitePage {
              nodes {
                path
              }
            }
          }
        `,
        resolvePages: ({
          allSitePage: { nodes: allPages },
        }) => {
          return allPages.map(page => {
            return { ...page }
          })
        },
        serialize: ({ path }) => {
          return {
            url: path,
            changefreq: path === '/financial-analyzer' ? 'daily' : 'monthly',
            priority: path === '/' ? 1.0 : path === '/financial-analyzer' ? 0.9 : 0.7,
          }
        },
      },
    },
  ],
};

// Environment-specific configurations
if (process.env.NODE_ENV === 'development') {
  module.exports.plugins.push({
    resolve: `gatsby-plugin-webpack-dev-middleware`,
    options: {
      // Development-specific webpack middleware
    },
  });
}

if (process.env.NODE_ENV === 'production') {
  // Add production-specific optimizations
  module.exports.plugins.push({
    resolve: `gatsby-plugin-preact`,
    options: {
      // Use Preact in production for smaller bundle size
    },
  });
}
// gatsby-node.js - Add routing for financial bot
const path = require('path');

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;

  // Create pages for markdown files (existing functionality)
  const blogPostTemplate = path.resolve('src/templates/post.js');
  
  const result = await graphql(`
    {
      postsRemark: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/posts/" } }
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              slug
              title
            }
          }
        }
      }
      projectsRemark: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/projects/" } }
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              slug
              title
            }
          }
        }
      }
    }
  `);

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild('Error while running GraphQL query.');
    return;
  }

  // Create blog post pages
  const posts = result.data.postsRemark.edges;
  posts.forEach(({ node }) => {
    const { slug } = node.frontmatter;
    createPage({
      path: `/pensieve/${slug}/`,
      component: blogPostTemplate,
      context: {
        slug,
      },
    });
  });

  // Create project detail pages (if needed)
  const projects = result.data.projectsRemark.edges;
  projects.forEach(({ node }) => {
    const { slug } = node.frontmatter;
    if (slug) {
      createPage({
        path: `/projects/${slug}/`,
        component: path.resolve('src/templates/project.js'),
        context: {
          slug,
        },
      });
    }
  });

  // Create financial bot page (already handled by page file, but can add dynamic routing here if needed)
  // This is useful if you want to add dynamic features like user-specific URLs
  
  // Example: Create user-specific bot pages
  // const users = ['demo', 'test']; // This would come from your API/database
  // users.forEach(user => {
  //   createPage({
  //     path: `/financial-analyzer/${user}/`,
  //     component: path.resolve('src/templates/user-bot.js'),
  //     context: {
  //       userId: user,
  //     },
  //   });
  // });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  // Add slug field to markdown nodes
  if (node.internal.type === 'MarkdownRemark') {
    const value = node.frontmatter.slug || node.frontmatter.title;
    createNodeField({
      name: 'slug',
      node,
      value: value ? value.toLowerCase().replace(/\s+/g, '-') : '',
    });
  }
};

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  // Add custom handling for financial bot page
  if (page.path.match(/^\/financial-analyzer/)) {
    deletePage(page);
    createPage({
      ...page,
      context: {
        ...page.context,
        // Add any custom context for the bot page
        isBot: true,
        requiresAuth: false, // Set to true if you want to require authentication
      },
    });
  }
};

// Handle webpack configuration for Three.js and other libraries
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === 'build-html' || stage === 'develop-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /three/,
            use: loaders.null(),
          },
        ],
      },
    });
  }

  // Add polyfills and resolve configurations
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        fs: false,
        path: require.resolve('path-browserify'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util'),
        buffer: require.resolve('buffer'),
        assert: require.resolve('assert'),
      },
    },
    plugins: [
      // Add any additional webpack plugins if needed
    ],
  });
};
// src/components/sections/Projects.js - Updated to include Financial Bot
import React, { useState, useEffect, useRef } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '../config';
import sr from '../utils/sr';
import { Icon } from '../components/icons';
import { mixins, media, Section, Button } from '../styles';

const StyledProjectsSection = styled(Section)`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  .archive-link {
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    &:after {
      bottom: 0.1em;
    }
  }

  .projects-grid {
    ${mixins.resetList};
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 15px;
    position: relative;
    margin-top: 50px;

    ${media.desktop`grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));`}
  }

  .more-button {
    ${mixins.button};
    margin: 80px auto 0;
  }
`;

const StyledProject = styled.div`
  position: relative;
  cursor: default;
  transition: var(--transition);

  &:hover,
  &:focus {
    outline: 0;
    .project-inner {
      transform: translateY(-7px);
    }
  }

  .project-inner {
    ${mixins.boxShadow};
    ${mixins.flexBetween};
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    height: 100%;
    padding: 2rem 1.75rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    border: 1px solid var(--light-navy);
    transition: var(--transition);
    overflow: auto;
  }

  .project-top {
    ${mixins.flexBetween};
    margin-bottom: 35px;

    .folder {
      color: var(--green);
      svg {
        width: 40px;
        height: 40px;
      }
    }

    .project-links {
      display: flex;
      align-items: center;
      margin-right: -10px;
      color: var(--light-slate);

      a {
        ${mixins.flexCenter};
        padding: 5px 7px;

        &.external {
          svg {
            width: 22px;
            height: 22px;
            margin-top: -4px;
          }
        }

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  .project-title {
    margin: 0 0 10px 0;
    color: var(--lightest-slate);
    font-size: var(--fz-xxl);

    a {
      position: static;

      &:before {
        content: '';
        display: block;
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }

  .project-description {
    color: var(--light-slate);
    font-size: 17px;

    a {
      ${mixins.inlineLink};
    }
  }

  .project-tech-list {
    display: flex;
    align-items: flex-end;
    flex-grow: 1;
    flex-wrap: wrap;
    padding: 0;
    margin: 20px 0 0 0;
    list-style: none;

    li {
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.75;

      &:not(:last-of-type) {
        margin-right: 15px;
      }
    }
  }

  // Special styling for featured bot project
  &.featured-bot {
    .project-inner {
      background: linear-gradient(135deg, var(--navy) 0%, var(--light-navy) 100%);
      border: 1px solid var(--green);
      box-shadow: 0 10px 30px -15px var(--green-shadow);
      
      &:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 40px -15px var(--green-shadow);
      }
    }

    .folder {
      color: var(--green);
      animation: pulse 2s infinite;
    }

    .project-title {
      color: var(--green);
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }
  }
`;

const Projects = () => {
  const data = useStaticQuery(graphql`
    query {
      projects: allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/content/projects/" }
          frontmatter: { showInProjects: { ne: false } }
        }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
              tech
              github
              external
              featured
            }
            html
          }
        }
      }
    }
  `);

  const [showMore, setShowMore] = useState(false);
  const revealTitle = useRef(null);
  const revealArchiveLink = useRef(null);
  const revealProjects = useRef([]);

  useEffect(() => {
    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealArchiveLink.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  const GRID_LIMIT = 6;
  const projects = data.projects.edges.filter(({ node }) => node);
  const firstSix = projects.slice(0, GRID_LIMIT);
  const projectsToShow = showMore ? projects : firstSix;

  // Add Smart Financial Analyzer as a special project
  const botProject = {
    node: {
      frontmatter: {
        title: 'Smart Financial Analyzer Bot',
        tech: ['React', 'Python', 'TensorFlow', 'Three.js', 'FastAPI', 'WebSocket'],
        github: 'https://github.com/yourusername/smart-financial-analyzer',
        external: '/financial-analyzer',
        featured: true
      },
      html: `
        <p>
          Bot AI canggih yang menganalisis kondisi keuangan dengan visualisasi 3D interaktif. 
          Menggunakan machine learning untuk insights personal dan rekomendasi investasi yang 
          disesuaikan dengan profil risiko pengguna.
        </p>
        <p>
          Fitur utama meliputi analisis pengeluaran real-time, rekomendasi investasi berbasis AI, 
          risk assessment personal, dan portfolio tracking dengan alert sistem.
        </p>
      `
    }
  };

  // Insert bot project at the beginning
  const allProjectsToShow = [botProject, ...projectsToShow];

  const projectInner = (node) => {
    const { frontmatter, html } = node;
    const { github, external, title, tech, featured } = frontmatter;

    return (
      <div className="project-inner">
        <header>
          <div className="project-top">
            <div className="folder">
              {title === 'Smart Financial Analyzer Bot' ? (
                <Icon name="Robot" />
              ) : (
                <Icon name="Folder" />
              )}
            </div>
            <div className="project-links">
              {github && (
                <a href={github} aria-label="GitHub Link" target="_blank" rel="noreferrer">
                  <Icon name="GitHub" />
                </a>
              )}
              {external && (
                <a
                  href={external}
                  aria-label="External Link"
                  className="external"
                  target={title === 'Smart Financial Analyzer Bot' ? '_self' : '_blank'}
                  rel="noreferrer"
                >
                  <Icon name="External" />
                </a>
              )}
            </div>
          </div>

          <h3 className="project-title">
            <a 
              href={external || github} 
              target={title === 'Smart Financial Analyzer Bot' ? '_self' : '_blank'}
              rel="noreferrer"
            >
              {title}
            </a>
          </h3>

          <div
            className="project-description"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </header>

        <footer>
          {tech && (
            <ul className="project-tech-list">
              {tech.map((tech, i) => (
                <li key={i}>{tech}</li>
              ))}
            </ul>
          )}
        </footer>
      </div>
    );
  };

  return (
    <StyledProjectsSection>
      <h2 ref={revealTitle}>Other Noteworthy Projects</h2>

      <Link className="archive-link" to="/archive" ref={revealArchiveLink}>
        view the archive
      </Link>

      <ul className="projects-grid">
        <TransitionGroup component={null}>
          {allProjectsToShow &&
            allProjectsToShow.map(({ node }, i) => (
              <CSSTransition
                key={i}
                classNames="fadeup"
                timeout={i >= GRID_LIMIT ? (i - GRID_LIMIT) * 300 : 300}
                exit={false}>
                <StyledProject
                  key={i}
                  ref={el => (revealProjects.current[i] = el)}
                  style={{
                    transitionDelay: `${i >= GRID_LIMIT ? (i - GRID_LIMIT) * 100 : 0}ms`,
                  }}
                  className={
                    node.frontmatter.title === 'Smart Financial Analyzer Bot' 
                      ? 'featured-bot' 
                      : ''
                  }
                >
                  {projectInner(node)}
                </StyledProject>
              </CSSTransition>
            ))}
        </TransitionGroup>
      </ul>

      <Button className="more-button" onClick={() => setShowMore(!showMore)}>
        Show {showMore ? 'Less' : 'More'}
      </Button>
    </StyledProjectsSection>
  );
};

export default Projects;
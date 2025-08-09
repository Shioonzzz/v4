import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import Layout from '../components/layout';
import BotLogin from '../components/BotLogin';
import BotDashboard from '../components/BotDashboard';
import Bot3DViewer from '../components/Bot3DViewer';
import { useAuth } from '../hooks/useAuth';
import { mixins, media } from '../styles';

const StyledMainContainer = styled.main`
  ${mixins.sidePadding};
  margin: 0 auto;
  width: 100%;
  max-width: 1600px;
  min-height: 100vh;
  padding-top: 200px;

  ${media.desktopXL`max-width: 1400px;`}
  ${media.desktop`max-width: 1200px;`}
  ${media.tablet`max-width: 900px;`}
  ${media.thone`
    padding-top: 150px;
  `}
`;

const StyledTitle = styled.h1`
  color: var(--lightest-slate);
  font-size: clamp(40px, 8vw, 80px);
  line-height: 1.1;
  margin: 0 0 30px 0;

  ${media.desktop`font-size: 70px;`}
  ${media.tablet`font-size: 60px;`}
  ${media.phablet`font-size: 50px;`}
  ${media.phone`font-size: 40px;`}
`;

const StyledSubtitle = styled.h2`
  color: var(--green);
  margin: 0 0 20px 0;
  font-weight: 400;
  font-size: var(--fz-md);
  font-family: var(--font-mono);
  line-height: 0.9;

  ${media.desktop`font-size: var(--fz-sm);`}
  ${media.tablet`font-size: var(--fz-sm);`}
`;

const StyledDescription = styled.div`
  margin-top: 25px;
  width: 100%;
  max-width: 540px;

  a {
    ${mixins.inlineLink};
  }
`;

const StyledBotContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  margin-top: 100px;

  ${media.tablet`
    grid-template-columns: 1fr;
    gap: 30px;
  `}
`;

const StyledFeatureList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 0;
  margin: 50px 0 0 0;
  overflow: hidden;
  list-style: none;

  li {
    position: relative;
    margin-bottom: 10px;
    padding-left: 20px;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);

    &:before {
      content: '▹';
      position: absolute;
      left: 0;
      color: var(--green);
      font-size: var(--fz-sm);
      line-height: 12px;
    }
  }
`;

const FinancialAnalyzerPage = ({ location }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const [showDemo, setShowDemo] = useState(false);

  return (
    <Layout location={location}>
      <Helmet title="Smart Financial Analyzer - Portfolio">
        <meta name="description" content="Smart Financial Analyzer Bot - AI-powered financial analysis with 3D visualization" />
      </Helmet>

      <StyledMainContainer>
        <StyledSubtitle>Featured Project</StyledSubtitle>
        <StyledTitle>Smart Financial Analyzer</StyledTitle>
        
        <StyledDescription>
          <p>
            Bot AI canggih yang membantu menganalisis kondisi keuangan dengan visualisasi 3D interaktif. 
            Menggunakan machine learning untuk memberikan insights personal dan rekomendasi investasi 
            yang disesuaikan dengan profil risiko pengguna.
          </p>
        </StyledDescription>

        <StyledFeatureList>
          <li>AI-Powered Financial Analysis</li>
          <li>Interactive 3D Data Visualization</li>
          <li>Real-time Market Insights</li>
          <li>Personal Risk Assessment</li>
          <li>Portfolio Tracking & Alerts</li>
          <li>Multi-language Support (ID/EN)</li>
        </StyledFeatureList>

        <StyledBotContainer>
          <div>
            <Bot3DViewer />
          </div>
          <div>
            {!loading && (
              isAuthenticated ? (
                <BotDashboard user={user} />
              ) : (
                <BotLogin onShowDemo={() => setShowDemo(true)} />
              )
            )}
          </div>
        </StyledBotContainer>

        {showDemo && (
          <div style={{ marginTop: '50px' }}>
            <h3 style={{ color: 'var(--lightest-slate)', marginBottom: '20px' }}>
              Demo Mode - Limited Features
            </h3>
            <BotDashboard user={null} demoMode={true} />
          </div>
        )}
      </StyledMainContainer>
    </Layout>
  );
};

export default FinancialAnalyzerPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`;
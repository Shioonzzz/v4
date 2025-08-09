import React, { useState } from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import { useAuth } from '../hooks/useAuth';
import { media, mixins } from '../styles';

const StyledLoginContainer = styled.div`
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
  padding: 40px;
  background: var(--navy);
  border-radius: 10px;
  border: 1px solid var(--light-navy);
  box-shadow: 0 10px 30px -15px var(--navy-shadow);

  ${media.tablet`
    padding: 30px;
    max-width: 350px;
  `}
`;

const StyledTitle = styled.h3`
  color: var(--lightest-slate);
  font-size: var(--fz-xxl);
  margin: 0 0 20px 0;
  text-align: center;
`;

const StyledSubtitle = styled.p`
  color: var(--slate);
  font-size: var(--fz-sm);
  text-align: center;
  margin-bottom: 30px;
  line-height: 1.5;
`;

const StyledForm = styled.form`
  width: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 15px;
  margin-bottom: 20px;
  background: var(--light-navy);
  border: 1px solid var(--light-navy);
  border-radius: 5px;
  color: var(--lightest-slate);
  font-size: var(--fz-md);
  font-family: var(--font-sans);

  &:focus {
    outline: none;
    border-color: var(--green);
    box-shadow: 0 0 0 3px var(--green-tint);
  }

  &::placeholder {
    color: var(--light-slate);
  }
`;

const StyledButton = styled.button`
  ${mixins.button};
  width: 100%;
  padding: 15px;
  margin-bottom: 15px;
  font-size: var(--fz-md);

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StyledDemoButton = styled.button`
  ${mixins.button};
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 1px solid var(--green);
  color: var(--green);
  font-size: var(--fz-sm);

  &:hover {
    background: var(--green-tint);
  }
`;

const StyledError = styled.div`
  color: var(--red);
  font-size: var(--fz-sm);
  text-align: center;
  margin-bottom: 20px;
  padding: 10px;
  background: rgba(255, 0, 0, 0.1);
  border-radius: 5px;
  border: 1px solid rgba(255, 0, 0, 0.2);
`;

const StyledToggle = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const StyledToggleButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.active ? 'var(--green)' : 'var(--slate)'};
  font-size: var(--fz-sm);
  font-family: var(--font-mono);
  cursor: pointer;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 5px;
  transition: var(--transition);

  &:hover {
    color: var(--green);
    background: var(--green-tint);
  }
`;

const StyledFeatures = styled.div`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--light-navy);

  h4 {
    color: var(--lightest-slate);
    font-size: var(--fz-lg);
    margin-bottom: 15px;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      color: var(--slate);
      font-size: var(--fz-sm);
      margin-bottom: 8px;
      padding-left: 15px;
      position: relative;

      &:before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--green);
        font-weight: bold;
      }
    }
  }
`;

const BotLogin = ({ onShowDemo }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Password tidak cocok');
        }
        await register(formData.email, formData.password, formData.fullName);
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: ''
    });
    setError('');
  };

  return (
    <StyledLoginContainer>
      <StyledTitle>Smart Financial Bot</StyledTitle>
      <StyledSubtitle>
        {isLogin 
          ? 'Masuk untuk mengakses analisis keuangan personal Anda'
          : 'Daftar untuk mulai menganalisis keuangan Anda'
        }
      </StyledSubtitle>

      <StyledToggle>
        <StyledToggleButton 
          active={isLogin} 
          onClick={() => isLogin || toggleMode()}
        >
          Login
        </StyledToggleButton>
        <StyledToggleButton 
          active={!isLogin} 
          onClick={() => !isLogin || toggleMode()}
        >
          Register
        </StyledToggleButton>
      </StyledToggle>

      {error && <StyledError>{error}</StyledError>}

      <StyledForm onSubmit={handleSubmit}>
        {!isLogin && (
          <StyledInput
            type="text"
            name="fullName"
            placeholder="Nama Lengkap"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        )}
        
        <StyledInput
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <StyledInput
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        {!isLogin && (
          <StyledInput
            type="password"
            name="confirmPassword"
            placeholder="Konfirmasi Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        )}
        
        <StyledButton type="submit" disabled={loading}>
          {loading ? 'Loading...' : isLogin ? 'Masuk' : 'Daftar'}
        </StyledButton>
      </StyledForm>

      <StyledDemoButton onClick={onShowDemo}>
        Coba Demo Gratis
      </StyledDemoButton>

      <StyledFeatures>
        <h4>Fitur Utama:</h4>
        <ul>
          <li>Analisis AI Real-time</li>
          <li>Visualisasi 3D Interaktif</li>
          <li>Rekomendasi Personal</li>
          <li>Risk Assessment</li>
          <li>Portfolio Tracking</li>
        </ul>
      </StyledFeatures>
    </StyledLoginContainer>
  );
};

export default BotLogin;
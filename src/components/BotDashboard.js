import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useAuth } from '../hooks/useAuth';
import { useBotAPI } from '../hooks/useBotAPI';
import { media, mixins } from '../styles';

const StyledDashboard = styled.div`
  max-width: 600px;
  width: 100%;
  background: var(--light-navy);
  border-radius: 10px;
  border: 1px solid var(--navy);
  overflow: hidden;

  ${media.tablet`
    max-width: 100%;
  `}
`;

const StyledHeader = styled.div`
  padding: 20px 30px;
  background: var(--navy);
  border-bottom: 1px solid var(--light-navy);
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    color: var(--lightest-slate);
    font-size: var(--fz-xl);
    margin: 0;
  }

  .user-info {
    color: var(--green);
    font-size: var(--fz-sm);
    font-family: var(--font-mono);
  }
`;

const StyledChatContainer = styled.div`
  height: 400px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const StyledMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--navy);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--green);
    border-radius: 3px;
  }
`;

const StyledMessage = styled.div`
  display: flex;
  flex-direction: ${props => props.isUser ? 'row-reverse' : 'row'};
  gap: 10px;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StyledMessageBubble = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  background: ${props => props.isUser ? 'var(--green)' : 'var(--navy)'};
  color: ${props => props.isUser ? 'var(--navy)' : 'var(--lightest-slate)'};
  font-size: var(--fz-sm);
  line-height: 1.4;
  word-wrap: break-word;

  .timestamp {
    font-size: var(--fz-xs);
    opacity: 0.7;
    margin-top: 5px;
    font-family: var(--font-mono);
  }
`;

const StyledAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.isUser ? 'var(--green)' : 'var(--blue)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--fz-sm);
  font-weight: bold;
  color: var(--navy);
  flex-shrink: 0;
`;

const StyledInputContainer = styled.div`
  padding: 20px;
  border-top: 1px solid var(--navy);
  background: var(--navy);
`;

const StyledInputWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: end;
`;

const StyledInput = styled.textarea`
  flex: 1;
  padding: 12px 16px;
  background: var(--light-navy);
  border: 1px solid var(--light-navy);
  border-radius: 20px;
  color: var(--lightest-slate);
  font-size: var(--fz-sm);
  font-family: var(--font-sans);
  resize: none;
  min-height: 40px;
  max-height: 100px;

  &:focus {
    outline: none;
    border-color: var(--green);
    box-shadow: 0 0 0 2px var(--green-tint);
  }

  &::placeholder {
    color: var(--light-slate);
  }
`;

const StyledSendButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--green);
  border: none;
  color: var(--navy);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  flex-shrink: 0;

  &:hover {
    background: var(--green-bright);
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const StyledQuickActions = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
`;

const StyledQuickButton = styled.button`
  padding: 8px 12px;
  background: transparent;
  border: 1px solid var(--green);
  border-radius: 15px;
  color: var(--green);
  font-size: var(--fz-xs);
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background: var(--green-tint);
  }
`;

const StyledTypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  color: var(--slate);
  font-size: var(--fz-sm);
  font-style: italic;

  .dots {
    display: flex;
    gap: 3px;

    span {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--slate);
      animation: typing 1.4s infinite;

      &:nth-child(2) {
        animation-delay: 0.2s;
      }

      &:nth-child(3) {
        animation-delay: 0.4s;
      }
    }
  }

  @keyframes typing {
    0%, 60%, 100% {
      opacity: 0.3;
    }
    30% {
      opacity: 1;
    }
  }
`;

const StyledDemoWarning = styled.div`
  padding: 15px 20px;
  background: rgba(255, 193, 7, 0.1);
  border-left: 4px solid #ffc107;
  margin-bottom: 20px;
  
  p {
    color: #ffc107;
    font-size: var(--fz-sm);
    margin: 0;
    font-family: var(--font-mono);
  }
`;

const BotDashboard = ({ user, demoMode = false }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { logout } = useAuth();
  const { sendMessage, isLoading } = useBotAPI();

  const quickActions = [
    'Analisis pengeluaran bulan ini',
    'Rekomendasi investasi',
    'Cek skor kredit',
    'Budget planning',
    'Risk assessment'
  ];

  useEffect(() => {
    // Welcome message
    const welcomeMessage = {
      id: Date.now(),
      text: demoMode 
        ? 'Selamat datang di Demo Mode! Fitur terbatas tersedia. Daftar untuk akses penuh.' 
        : `Halo ${user?.fullName || 'User'}! Saya siap membantu menganalisis keuangan Anda. Apa yang ingin Anda ketahui?`,
      isUser: false,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([welcomeMessage]);
  }, [user, demoMode]);

  const handleSendMessage = async (text = inputValue.trim()) => {
    if (!text || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text,
      isUser: true,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Simulate API delay for demo
      if (demoMode) {
        setTimeout(() => {
          const demoResponse = {
            id: Date.now() + 1,
            text: getDemoResponse(text),
            isUser: false,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, demoResponse]);
          setIsTyping(false);
        }, 1500);
      } else {
        const response = await sendMessage(text, user?.id);
        const botMessage = {
          id: Date.now() + 1,
          text: response.message,
          isUser: false,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        isUser: false,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const getDemoResponse = (userText) => {
    const responses = {
      'analisis pengeluaran': 'Demo: Pengeluaran terbesar bulan ini adalah makanan (35%) dan transportasi (25%). Daftar untuk analisis mendalam!',
      'rekomendasi investasi': 'Demo: Berdasarkan profil risiko, reksa dana campuran cocok untuk Anda. Daftar untuk rekomendasi personal!',
      'budget planning': 'Demo: Alokasi ideal: 50% kebutuhan, 30% keinginan, 20% tabungan. Daftar untuk planning detail!',
      'default': 'Demo: Ini adalah mode demo terbatas. Silakan daftar untuk mengakses semua fitur AI dan analisis mendalam!'
    };

    const lowerText = userText.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerText.includes(key)) {
        return response;
      }
    }
    return responses.default;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

return (
    <StyledDashboard>
      <StyledHeader>
        <h3>Financial Bot</h3>
        <div className="user-info">
          {demoMode ? 'Demo Mode' : user?.email || 'Guest'}
          {!demoMode && (
            <button 
              onClick={logout}
              style={{ 
                marginLeft: '10px', 
                background: 'none', 
                border: 'none', 
                color: 'var(--red)', 
                cursor: 'pointer',
                fontSize: 'var(--fz-xs)'
              }}
            >
              Logout
            </button>
          )}
        </div>
      </StyledHeader>

      {demoMode && (
        <StyledDemoWarning>
          <p>⚠️ Mode Demo - Fitur terbatas. Daftar untuk akses penuh ke semua fitur.</p>
        </StyledDemoWarning>
      )}
    </StyledDashboard>
); // <-- Add this line to close the return statement
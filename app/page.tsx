'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  CircularProgress,
  Box,
  AppBar,
  Toolbar,
} from '@mui/material';
import { styled } from '@mui/system';
import dynamic from 'next/dynamic';

import adData from '@/data/ads.json';

// Dynamically import AdModal to avoid SSR issues with framer-motion
const AdModal = dynamic(() => import('@/app/components/AdModal'), { ssr: false });

interface HistoryItem {
  role: string;
  content: string;
}

const StyledPaper = styled(Paper)({
  padding: '1rem',
  marginTop: '1rem',
  marginBottom: '1rem',
  fontFamily: 'Open Sans, sans-serif',
});

const StyledButton = styled(Button)({
  height: '56px', // to match TextField height
});

const FixedAppBar = styled(AppBar)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1100,
});

const sponsorInfo = {
  Pfizer: {
    logo: '/logos/pfizer-logo.png',
    link: 'https://www.pfizer.com/',
  },
  GSK: {
    logo: '/logos/gsk-logo.png',
    link: 'https://www.gsk.com/',
  },
  Genentech: {
    logo: '/logos/genentech-logo.png',
    link: 'https://www.gene.com/',
  },
  'Eli Lilly': {
    logo: '/logos/eli-lilly-logo.png',
    link: 'https://www.lilly.com/',
  },
};

//TODO: This should also incorporate a call to the modal to determine category as well, but might not be scalable
function findAdMatch(question: string) {
  const lowerQ = question.toLowerCase();
  for (const ad of adData) {
    if (ad.keywords.some((keyword: string) => lowerQ.includes(keyword))) {
      return ad;
    }
  }
  return null;
}

export default function Home() {
  const [question, setQuestion] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [answer, setAnswer] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [sponsor, setSponsor] = useState<string | null>(null);
  const [showAdModal, setShowAdModal] = useState<boolean>(false);
  const [pendingAnswer, setPendingAnswer] = useState<string>('');

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const adMatch = findAdMatch(question);
    const matchedSponsor = adMatch?.sponsor ?? null;

    if (matchedSponsor) {
      setSponsor(matchedSponsor);
      setShowAdModal(true);
    } else {
      setLoading(true); // Show page-level spinner only if no ad
    }

    try {
      const response = await axios.post('/api/ask', {
        question,
        history,
      });

      if (matchedSponsor) {
        setPendingAnswer(response.data.answer);
      } else {
        setHistory([
          ...history,
          { role: 'user', content: question },
          { role: 'assistant', content: response.data.answer },
        ]);
        setQuestion('');
      }

      setAnswer(response.data.answer);
    } catch (err) {
      console.error('Error fetching the answer:', err);
    } finally {
      setLoading(false); // Always stop page-level spinner
    }
  };

  const handleNewConversation = () => {
    setHistory([]);
    setAnswer('');
    setQuestion('');
    setSponsor(null);
    setShowAdModal(false);
    scrollToBottom();
  };

  const handleContinue = () => {
    if (sponsor && pendingAnswer) {
      setHistory([
        ...history,
        { role: 'user', content: question },
        { role: 'assistant', content: pendingAnswer },
      ]);
      setQuestion(''); // Clear input AFTER answer shown
    }
    setShowAdModal(false);
  };

  const handleLearnMore = () => {
    if (sponsor && sponsorInfo[sponsor as keyof typeof sponsorInfo]) {
      window.open(sponsorInfo[sponsor as keyof typeof sponsorInfo]?.link, '_blank');
    }
    handleContinue();
  };

  useEffect(() => {
    if (!loading) scrollToBottom();
  }, [loading, history]);

  return (
    <>
      <FixedAppBar position="static">
        <Container maxWidth="md">
          <Toolbar disableGutters>
            <Typography variant="h6" style={{ flexGrow: 1, fontFamily: 'Roboto, sans-serif' }}>
              Simple Ask
            </Typography>
            <Button color="inherit" href="/report">
              View Report
            </Button>
            <Button color="inherit" onClick={handleNewConversation}>
              New Conversation
            </Button>
          </Toolbar>
        </Container>
      </FixedAppBar>

      <Container
        maxWidth="md"
        style={{ marginTop: '120px', fontFamily: 'Roboto, sans-serif', marginBottom: '250px' }}
      >
        {history.length > 0 && (
          <List>
            {history.map((item, index) => (
              <StyledPaper elevation={3} key={index}>
                <Typography variant="body1" component="div">
                  <strong>{item.role.charAt(0).toUpperCase() + item.role.slice(1)}:</strong>
                </Typography>
                <Box
                  component="div"
                  dangerouslySetInnerHTML={{ __html: item.content.replace(/\n/g, '<br />') }}
                />
              </StyledPaper>
            ))}
          </List>
        )}

        <StyledPaper elevation={3}>
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
          >
            <TextField
              label="Ask a question"
              variant="outlined"
              fullWidth
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={loading}
            />
            <StyledButton type="submit" variant="contained" color="primary" disabled={loading}>
              Ask
            </StyledButton>
          </form>
        </StyledPaper>

        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <CircularProgress />
          </Box>
        )}

        {/* 🧠 Show Ad Modal */}
        {showAdModal && sponsor && (
          <AdModal
            sponsor={sponsor}
            logoSrc={sponsorInfo[sponsor as keyof typeof sponsorInfo]?.logo || ''}
            loading={loading}
            pendingAnswer={pendingAnswer}
            onContinue={handleContinue}
            onLearnMore={handleLearnMore}
          />
        )}
      </Container>
    </>
  );
}

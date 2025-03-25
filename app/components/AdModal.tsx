'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';

interface AdModalProps {
  sponsor: string;
  logoSrc: string;
  loading: boolean;
  pendingAnswer: string;
  onContinue: () => void;
  onLearnMore: () => void;
}

// Modal that appears when ad is matched, displays sponsor and loading/complete state
const AdModal: React.FC<AdModalProps> = ({
  sponsor,
  logoSrc,
  loading,
  pendingAnswer,
  onContinue,
  onLearnMore,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1300,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper elevation={6} sx={{ p: 4, width: '90%', maxWidth: 500, textAlign: 'center' }}>
        <img src={logoSrc} alt={`${sponsor} logo`} style={{ maxHeight: 80, marginBottom: 20 }} />
        <Typography variant="h6" gutterBottom>
          Sponsored by {sponsor}
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          This content is brought to you by {sponsor}, a trusted leader in medical treatments.
        </Typography>

        {/* Spinner while waiting for answer, then checkmark */}
        {loading || !pendingAnswer ? (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Box my={2}>
            <Typography variant="body2" color="success.main">
              Answer loaded!
            </Typography>
          </Box>
        )}

        <Box display="flex" justifyContent="space-around" mt={2}>
          <Button variant="contained" onClick={onContinue}>
            Continue to Answer
          </Button>
          <Button variant="outlined" onClick={onLearnMore}>
            Learn More
          </Button>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default AdModal;

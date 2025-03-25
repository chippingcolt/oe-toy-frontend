'use client';

import { useEffect, useState } from 'react';
// prettier-ignore
import { Container, Button, Typography, Paper, TableCell, TableRow, Table, TableBody, TableHead } from '@mui/material';

import Link from 'next/link';

import { Tooltip, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function ReportPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/report')
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error('Failed to load report:', err));
  }, []);

  return (
    <Container maxWidth="md" style={{ marginTop: '100px' }}>
      <Typography variant="h4" gutterBottom>
        Ad Category Report
      </Typography>
      <Button component={Link} href="/" variant="outlined" style={{ marginBottom: '1rem' }}>
        ⬅ Back to App
      </Button>

      {data.length > 0 ? (
        <Paper elevation={3} style={{ padding: '1rem' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Category</strong>{' '}
                  <Tooltip title="The matched medical category for the question.">
                    <IconButton size="small">
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <strong>Question</strong>{' '}
                  <Tooltip title="The original question asked by the user.">
                    <IconButton size="small">
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <strong>Confidence</strong>{' '}
                  <Tooltip title="Confidence score (0–100). Keyword matches are 100 by default.">
                    <IconButton size="small">
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <strong>Used GPT?</strong>{' '}
                  <Tooltip title="Indicates whether GPT was used to classify the question.">
                    <IconButton size="small">
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <strong>Timestamp</strong>{' '}
                  <Tooltip title="When this match was recorded.">
                    <IconButton size="small">
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((entry, idx) => (
                <TableRow key={idx}>
                  <TableCell>{entry.category}</TableCell>
                  <TableCell>{entry.question}</TableCell>
                  <TableCell>{entry.confidence != null ? `${entry.confidence}%` : 'N/A'}</TableCell>
                  <TableCell>{entry.usedAI ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ) : (
        <Typography variant="body1">No data logged yet.</Typography>
      )}
    </Container>
  );
}

import { useState } from 'react'
import './App.css'
import { Alert, Box, Button, CircularProgress, Container, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import axios from 'axios';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('Failed to generate eamil reply. Please try again');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="app-shell">
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
        <Paper
          elevation={0}
          className="main-card"
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: 4,
            border: '1px solid rgba(13, 38, 59, 0.08)'
          }}
        >
          <Typography
            variant="overline"
            sx={{
              letterSpacing: '0.16em',
              fontWeight: 700,
              color: 'rgba(13, 38, 59, 0.72)'
            }}
          >
            EMAIL ASSISTANT
          </Typography>

          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#0d263b',
              mb: 0.5,
              fontSize: { xs: '2rem', sm: '2.6rem' }
            }}
          >
            Email Response Generator
          </Typography>

          <Typography sx={{ color: 'rgba(13, 38, 59, 0.72)', mb: 3 }}>
            Paste an incoming email, choose a tone, and generate a polished response instantly.
          </Typography>

          <Box>
            <TextField
              fullWidth
              multiline
              rows={7}
              variant="outlined"
              label="Original Email Content"
              value={emailContent || ''}
              onChange={(e) => setEmailContent(e.target.value)}
              sx={{
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.74)'
                }
              }}
            />

            <FormControl fullWidth sx={{ mb: 2.5 }}>
              <InputLabel>Tone (Optional)</InputLabel>
              <Select
                value={tone || ''}
                label="Tone (Optional)"
                onChange={(e) => setTone(e.target.value)}
                sx={{
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.74)'
                }}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!emailContent || loading}
              fullWidth
              sx={{
                py: 1.4,
                borderRadius: 99,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #0b6a88 0%, #0c8f6f 100%)',
                boxShadow: '0 12px 24px rgba(12, 106, 136, 0.24)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #09546d 0%, #0a755b 100%)'
                }
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Generate Reply'}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2.5, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {generatedReply && (
            <Box sx={{ mt: 3.5 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#0d263b', fontWeight: 700 }}>
                Generated Reply
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={7}
                variant="outlined"
                value={generatedReply || ''}
                inputProps={{ readOnly: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.82)'
                  }
                }}
              />

              <Button
                variant="outlined"
                sx={{
                  mt: 2,
                  borderRadius: 99,
                  textTransform: 'none',
                  fontWeight: 700,
                  borderColor: 'rgba(11, 106, 136, 0.4)',
                  color: '#0b6a88',
                  '&:hover': {
                    borderColor: '#0b6a88',
                    background: 'rgba(11, 106, 136, 0.08)'
                  }
                }}
                onClick={() => navigator.clipboard.writeText(generatedReply)}
              >
                Copy to Clipboard
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  )
}

export default App
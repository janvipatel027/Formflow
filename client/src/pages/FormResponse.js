import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  Alert,
  LinearProgress,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { formService } from '../services/api';

function FormResponse() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadForm = async () => {
      try {
        setLoading(true);
        const data = await formService.getForm(formId);
        if (!data.questions) {
          data.questions = [];
        }
        setForm(data);
        setAnswers(() => {
          const initialAnswers = {};
          data.questions.forEach((q, index) => {
            if (q.type === 'checkbox') {
              initialAnswers[index] = [];
            } else if (q.type === 'file') {
              initialAnswers[index] = null;
            } else {
              initialAnswers[index] = '';
            }
          });
          return initialAnswers;
        });
        setError(null);
      } catch (err) {
        setError('Failed to load form. Please try again later.');
        console.error('Error loading form:', err);
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [formId]);

  const handleAnswerChange = (index, value) => {
    setAnswers(prev => ({
      ...prev,
      [index]: value,
    }));
  };

  const handleCheckboxChange = (index, optionValue) => {
    setAnswers(prev => {
      const current = prev[index] || [];
      if (current.includes(optionValue)) {
        return {
          ...prev,
          [index]: current.filter(v => v !== optionValue),
        };
      } else {
        return {
          ...prev,
          [index]: [...current, optionValue],
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      for (let i = 0; i < form.questions.length; i++) {
        const q = form.questions[i];
        if (q.required) {
          const answer = answers[i];
          if (q.type === 'checkbox' && (!answer || answer.length === 0)) {
            setError(`Please answer the required question: ${q.title}`);
            return;
          }
          if (!answer) {
            setError(`Please answer the required question: ${q.title}`);
            return;
          }
        }
      }

      if (form.settings?.collectEmail && !email) {
        setError('Please provide your email address');
        return;
      }

      const response = {
        formId,
        answers: Object.entries(answers).map(([index, value]) => ({
          questionId: form.questions[index].id,
          value,
        })),
        respondentEmail: email || undefined,
        submittedAt: new Date(),
      };

      await formService.submitResponse(response);
      setSubmitted(true);
      setError(null);
    } catch (err) {
      setError('Failed to submit response. Please try again later.');
      console.error('Error submitting response:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        {error}
      </Alert>
    );
  }

  if (submitted) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Thank you for your response!
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Box>
    );
  }

  const renderQuestion = (question, index) => {
    switch (question.type) {
      case 'short':
        return (
          <TextField
            fullWidth
            value={answers[index] || ''}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            required={question.required}
          />
        );
      case 'paragraph':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            value={answers[index] || ''}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            required={question.required}
          />
        );
      case 'multiple':
        return (
          <RadioGroup
            value={answers[index] || ''}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
          >
            {question.options?.map((option, i) => (
              <FormControlLabel
                key={i}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        );
      case 'checkbox':
        return (
          <FormGroup>
            {question.options?.map((option, i) => (
              <FormControlLabel
                key={i}
                control={
                  <Checkbox
                    checked={(answers[index] || []).includes(option)}
                    onChange={() => handleCheckboxChange(index, option)}
                  />
                }
                label={option}
              />
            ))}
          </FormGroup>
        );
      case 'file':
        return (
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              handleAnswerChange(index, file);
            }}
            required={question.required}
          />
        );
      case 'linear':
        return (
          <Box>
            <Typography>{question.title}</Typography>
            <Slider
              value={answers[index] || 0}
              onChange={(e, value) => handleAnswerChange(index, value)}
              min={1}
              max={5} // Adjust min and max based on your requirements
              valueLabelDisplay="auto"
            />
          </Box>
        );
      case 'grid':
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>{question.title}</Typography>
    
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell /> {/* Empty top-left cell */}
                  {question.columns?.map((column, colIndex) => (
                    <TableCell key={colIndex} align="center">
                      {column}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
    
              <TableBody>
                {question.rows?.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell sx={{ fontWeight: 'bold' }}>{row}</TableCell>
                    {question.columns?.map((column, colIndex) => (
                      <TableCell key={colIndex} align="center">
                        <Radio
                          name={`grid-${index}-${row}`}  // Add name attribute for grouping radios per row
                          checked={answers[index][row] === column}
                          onChange={() => {
                            const currentAnswers = answers[index] || {};
      
                            setAnswers((prev) => ({
                              ...prev,
                              [index]: {
                                ...currentAnswers,
                                [row]: column,
                              },
                            }));
                          }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        );
      default:
        return (
          <Typography color="error">
            Unsupported question type: {question.type}
          </Typography>
        );
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {form.title || 'Untitled Form'}
        </Typography>
        {form.description && (
          <Typography variant="body1" color="text.secondary" paragraph>
            {form.description}
          </Typography>
        )}
      </Paper>

      <form onSubmit={handleSubmit}>
        {form.questions.map((question, index) => (
          <Paper key={index} sx={{ p: 4, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              {question.title}
              {question.required && ' *'}
            </Typography>
            {renderQuestion(question, index)}
          </Paper>
        ))}

        {form.settings?.collectEmail && (
          <TextField
            fullWidth
            label="Your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mt: 2 }}
          />
        )}

        <Box sx={{ mt: 4 }}>
          <Button type="submit" variant="contained" size="large">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default FormResponse;
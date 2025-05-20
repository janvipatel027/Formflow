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
  LinearProgress,
  Alert,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { formService } from '../services/api';

function FormView() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadForm();
  }, [formId]);

  const loadForm = async () => {
    try {
      setLoading(true);
      const data = await formService.getForm(formId);
      if (!data.questions) {
        data.questions = [];
      }
      setForm(data);
      initializeAnswers(data.questions);
      setError(null);
    } catch (err) {
      setError('Failed to load form');
      console.error('Error loading form:', err);
    } finally {
      setLoading(false);
    }
  };

  const initializeAnswers = (questions) => {
    const initialAnswers = {};
    questions.forEach((q, index) => {
      if (q.type === 'checkbox') {
        initialAnswers[index] = [];
      } else if (q.type === 'grid') {
        initialAnswers[index] = {};
        q.settings.grid.rows.forEach(row => {
          initialAnswers[index][row] = '';
        });
      } else {
        initialAnswers[index] = '';
      }
    });
    setAnswers(initialAnswers);
  };

  const handleAnswerChange = (index, value, rowKey = null) => {
    setAnswers(prev => {
      if (rowKey !== null) {
        return {
          ...prev,
          [index]: {
            ...prev[index],
            [rowKey]: value
          }
        };
      }
      return {
        ...prev,
        [index]: value
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const requiredQuestions = form.questions
        .map((q, i) => ({ question: q, index: i }))
        .filter(({ question }) => question.required);

      const unansweredRequired = requiredQuestions.filter(({ index, question }) => {
        const answer = answers[index];
        if (question.type === 'grid') {
          return Object.values(answer).some(val => !val);
        }
        return !answer || (Array.isArray(answer) && answer.length === 0);
      });

      if (unansweredRequired.length > 0) {
        setError('Please answer all required questions');
        return;
      }

      if (form.settings?.collectEmail && !email) {
        setError('Please provide your email address');
        return;
      }

      const response = {
        formId,
        answers: Object.entries(answers).map(([index, value]) => {
          if (form.questions[index].type === 'file' && value instanceof File) {
            return {
              questionId: form.questions[index]._id,
              type: form.questions[index].type,
              value: value.name
            };
          }
          return {
            questionId: form.questions[index]._id,
            type: form.questions[index].type,
            value
          };
        }),
        respondentEmail: email || undefined,
        startTime: new Date()
      };

      await formService.submitResponse(response);
      setSubmitted(true);
      setError(null);
    } catch (err) {
      setError('Failed to submit form');
      console.error('Error submitting form:', err);
    }
  };

  const renderQuestion = (question, index) => {
    switch (question.type) {
      case 'short':
      case 'paragraph':
      case 'email':
      case 'number':
      case 'phone':
      case 'url':
        return (
          <TextField
            fullWidth
            multiline={question.type === 'paragraph'}
            rows={question.type === 'paragraph' ? 4 : 1}
            type={question.type === 'number' ? 'number' : 
                  question.type === 'email' ? 'email' :
                  question.type === 'url' ? 'url' : 'text'}
            value={answers[index] || ''}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            required={question.required}
            placeholder={question.description || ''}
          />
        );

      case 'multiple':
        return (
          <RadioGroup
            value={answers[index] || ''}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
          >
            {question.options?.map((option, i) => {
              const optionValue = typeof option === 'string' ? option : (option.value || option.text);
              const optionLabel = typeof option === 'string' ? option : (option.text || option.value);
              return (
                <FormControlLabel
                  key={i}
                  value={optionValue}
                  control={<Radio />}
                  label={optionLabel}
                />
              );
            })}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <FormGroup>
            {question.options?.map((option, i) => {
              const optionValue = typeof option === 'string' ? option : (option.value || option.text);
              const optionLabel = typeof option === 'string' ? option : (option.text || option.value);
              return (
                <FormControlLabel
                  key={i}
                  control={
                    <Checkbox
                      checked={answers[index]?.includes(optionValue)}
                      onChange={(e) => {
                        const newValue = e.target.checked
                          ? [...(answers[index] || []), optionValue]
                          : answers[index].filter(v => v !== optionValue);
                        handleAnswerChange(index, newValue);
                      }}
                    />
                  }
                  label={optionLabel}
                />
              );
            })}
          </FormGroup>
        );

      case 'dropdown':
        return (
          <FormControl fullWidth>
            <Select
              value={answers[index] || ''}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                <em>Select an option</em>
              </MenuItem>
              {question.options?.map((option, i) => {
                const optionValue = typeof option === 'string' ? option : (option.value || option.text);
                const optionLabel = typeof option === 'string' ? option : (option.text || option.value);
                return (
                  <MenuItem key={i} value={optionValue}>
                    {optionLabel}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        );

      case 'linear':
        const { min, max, minLabel, maxLabel } = question.settings?.linearScale || {};
        return (
          <Box sx={{ px: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption">{minLabel || min}</Typography>
              <Typography variant="caption">{maxLabel || max}</Typography>
            </Box>
            <RadioGroup
              row
              value={answers[index] || ''}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              sx={{ justifyContent: 'space-between' }}
            >
              {Array.from({ length: (max - min) + 1 }, (_, i) => (
                <FormControlLabel
                  key={i}
                  value={(min + i).toString()}
                  control={<Radio />}
                  label={min + i}
                  labelPlacement="top"
                />
              ))}
            </RadioGroup>
          </Box>
        );

      case 'grid':
        return (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  {question.settings.grid.columns.map((col, i) => (
                    <TableCell key={i} align="center">{col}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {question.settings.grid.rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell component="th" scope="row">
                      {row}
                    </TableCell>
                    {question.settings.grid.columns.map((col, colIndex) => (
                      <TableCell key={colIndex} align="center">
                        <Radio
                          name={`grid-${index}-${row}`}  // Add name attribute for grouping radios per row
                          checked={answers[index][row] === col}
                          onChange={() => handleAnswerChange(index, col, row)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );

      case 'date':
        return (
          <TextField
            fullWidth
            type="date"
            value={answers[index] || ''}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            required={question.required}
            InputLabelProps={{ shrink: true }}
          />
        );

      case 'time':
        return (
          <TextField
            fullWidth
            type="time"
            value={answers[index] || ''}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            required={question.required}
            InputLabelProps={{ shrink: true }}
          />
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

      default:
        return (
          <Typography color="error">
            Unsupported question type: {question.type}
          </Typography>
        );
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (!form) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Form not found</Alert>
      </Box>
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
      </Paper>

      <form onSubmit={handleSubmit}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {form.questions.map((question, index) => (
          <Paper key={index} sx={{ p: 4, mb: 2 }}>
            <FormControl fullWidth required={question.required}>
              <FormLabel sx={{ mb: 2 }}>
                <Typography variant="h6">
                  {question.title}
                  {question.required && ' *'}
                </Typography>
                {question.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {question.description}
                  </Typography>
                )}
              </FormLabel>
              {renderQuestion(question, index)}
            </FormControl>
          </Paper>
        ))}

        <Box sx={{ mt: 4 }}>
          <Button type="submit" variant="contained" size="large">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default FormView;

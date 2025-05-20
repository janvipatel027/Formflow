import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formService } from '../services/api';

const COLORS = ['#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4'];

function ResponseView() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Form ID:', formId);
    if (!formId) return;
    loadData();
  }, [formId]);


  const loadData = async () => {
    try {
      setLoading(true);
      const [formData, responsesData, statsData] = await Promise.all([
        formService.getForm(formId),
        formService.getResponses(formId),
        formService.getResponseStats(formId),
      ]);
      setForm(formData);
      setResponses(responsesData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError('Failed to load responses');
      console.error('Error loading responses:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderSummary = () => {
    if (!stats) return null;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Responses</Typography>
              <Typography variant="h3">{stats.totalResponses}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Average Duration</Typography>
              <Typography variant="h3">
                {Math.round(stats.averageDuration / 60)} min
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          {form.questions.map((question, index) => (
            <Paper key={index} sx={{ p: 3, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                {question.title}
              </Typography>
              {renderQuestionStats(question, stats.questionStats[question.id])}
            </Paper>
          ))}
        </Grid>
      </Grid>
    );
  };

  const renderQuestionStats = (question, questionStats) => {
    if (!questionStats) return null;

    const data = Object.entries(questionStats.answerDistribution).map(
      ([value, count]) => ({
        name: value,
        value: count,
      })
    );

    switch (question.type) {
      case 'multiple':
      case 'checkbox':
        return (
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#673AB7" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        );

      case 'linear':
        return (
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#673AB7" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        );

      default:
        return (
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        );
    }
  };

  // const renderResponses = () => {
  //   return (
  //     <TableContainer component={Paper}>
  //       <Table>
  //         <TableHead>
  //           <TableRow>
  //             <TableCell>Timestamp</TableCell>
  //             <TableCell>Email</TableCell>
  //             {form.questions.map((question, index) => (
  //               <TableCell key={index}>{question.title}</TableCell>
  //             ))}
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {responses.map((response, responseIndex) => (
  //             <TableRow key={responseIndex}>
  //               <TableCell>
  //                 {new Date(response.createdAt).toLocaleString()}
  //               </TableCell>
  //               <TableCell>{response.respondentEmail || '-'}</TableCell>
  //               {form.questions.map((question, questionIndex) => (
  //                 <TableCell key={questionIndex}>
  //                   <TableCell key={questionIndex}>
  //                     {renderResponseValue(
  //                       response.answers.find((a) => a.questionId === question._id)?.value,
  //                       question.type
  //                     )}
  //                   </TableCell>

  //                 </TableCell>
  //               ))}
  //             </TableRow>
  //           ))}
  //         </TableBody>
  //       </Table>
  //     </TableContainer>
  //   );
  // };

const renderResponses = () => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Email</TableCell>
              {form.questions.map((question, index) => (
                <TableCell key={index}>{question.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {responses.map((response, responseIndex) => (
              <TableRow key={responseIndex}>
                <TableCell>
                  {new Date(response.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>{response.respondentEmail || '-'}</TableCell>
                {/* {form.questions.map((question, questionIndex) => (
                  <TableCell key={questionIndex}>
                    {renderResponseValue(
                      response.answers.find((a) => a.questionId == question.id)?.value,
                      question.type
                    )}
                  </TableCell>
                ))} */}
            {form.questions.map((question, questionIndex) => {
              console.log('Matching question.id:', question.id);
              console.log('Response answers:', response.answers);
              const answer = response.answers[questionIndex];
              console.log('Found answer:', answer);
              return (
                <TableCell key={questionIndex}>
                  {renderResponseValue(answer?.value, question.type)}
                </TableCell>
              );
            })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderResponseValue = (value, questionType) => {
    if (!value || value.length === 0) return '-';

    if (questionType === 'file') {
      if (Array.isArray(value)) {
        // value is array of file objects, extract filenames
        if (value.length > 0 && typeof value[0] === 'object' && 'value' in value[0]) {
          return value.map(fileObj => fileObj.value).join(', ');
        }
        // fallback if array of strings
        return value.join(', ');
      }
      if (typeof value === 'string') {
        return value;
      }
      if (value instanceof File) {
        return value.name;
      }
    }

    if (questionType === 'grid' && typeof value === 'object') {
      return Object.entries(value)
        .map(([row, column]) => `${row}: ${column}`)
        .join(', ');
    }

    if (Array.isArray(value)) return value.join(', ');
    return value.toString();
  };


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!form) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Form not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {form.title} - Responses
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Summary" />
          <Tab label="Individual Responses" />
        </Tabs>
      </Box>

      {activeTab === 0 ? renderSummary() : renderResponses()}
    </Box>
  );
}

export default ResponseView;

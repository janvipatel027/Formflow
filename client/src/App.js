import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import FormBuilder from './pages/FormBuilder';
import FormView from './pages/FormView';
import FormResponse from './pages/FormResponse';
import ResponseView from './pages/ResponseView';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<FormBuilder />} />
          <Route path="/edit/:formId" element={<FormBuilder />} />
          <Route path="/form/:formId" element={<FormView />} />
          <Route path="/response/:formId" element={<FormResponse />} />
          <Route path="/responses/:formId" element={<ResponseView />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
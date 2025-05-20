import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  FormControlLabel,
  Switch,
  Divider,
  Alert,
  Link,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragHandle as DragIcon,
  Settings as SettingsIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { formService } from '../services/api';
import QuestionCard from '../components/QuestionCard';

function FormBuilder() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: 'Untitled Form',
    description: '',
    questions: [],
    settings: {
      collectEmail: false,
      limitOneResponse: false,
      showProgress: true,
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (formId) {
      loadForm();
    }
  }, [formId]);

  const loadForm = async () => {
    try {
      setLoading(true);
      const data = await formService.getForm(formId);
      // Ensure settings is not null
      if (!data.settings) {
        data.settings = {
          collectEmail: false,
          limitOneResponse: false,
          showProgress: true,
        };
      }
      // Ensure questions is an array
      if (!Array.isArray(data.questions)) {
        data.questions = [];
      }
      // Assign unique id to each question if not present
      data.questions = data.questions.map((q) => ({
        ...q,
        id: q.id || uuidv4(),
      }));
      setForm(data);
      setError(null);
    } catch (err) {
      setError('Failed to load form');
      console.error('Error loading form:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (formId) {
        await formService.updateForm(formId, form);
        setSaved(true);
      } else {
        const newForm = await formService.createForm(form);
        setSaved(true);
        navigate(`/edit/${newForm.id || newForm._id}`);
      }
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('Failed to save form');
      console.error('Error saving form:', err);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setForm({
      ...form,
      questions: [
        ...form.questions,
        {
          id: uuidv4(),
          type: 'short',
          title: '',
          required: false,
          options: [],
        },
      ],
    });
  };

  const updateQuestion = (index, question) => {
    const newQuestions = [...form.questions];
    newQuestions[index] = question;
    setForm({ ...form, questions: newQuestions });
  };

  const deleteQuestion = (index) => {
    const newQuestions = form.questions.filter((_, i) => i !== index);
    setForm({ ...form, questions: newQuestions });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const questions = Array.from(form.questions || []);
    const [reorderedQuestion] = questions.splice(result.source.index, 1);
    questions.splice(result.destination.index, 0, reorderedQuestion);

    setForm({ ...form, questions: questions });
  };

  const previewForm = () => {
    if (formId) {
      navigate(`/form/${formId}`);
    } else {
      alert('Please save the form before previewing.');
    }
  };

  const getShareableLink = () => {
    if (!formId) return '';
    return `${window.location.origin}/response/${formId}`;
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {saved && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Form saved successfully!
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          label="Form Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          variant="standard"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Form Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          multiline
          rows={2}
          variant="standard"
        />
      </Paper>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {(form.questions || []).map((question, index) => (
                <Draggable
                  key={index}
                  draggableId={`question-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <QuestionCard
                        question={question}
                        index={index}
                        onUpdate={(q) => updateQuestion(index, q)}
                        onDelete={() => deleteQuestion(index)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Box sx={{ mt: 2, mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addQuestion}
          fullWidth
        >
          Add Question
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Form Settings
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={form.settings.collectEmail}
              onChange={(e) =>
                setForm({
                  ...form,
                  settings: { ...form.settings, collectEmail: e.target.checked },
                })
              }
            />
          }
          label="Collect email addresses"
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.settings.limitOneResponse}
              onChange={(e) =>
                setForm({
                  ...form,
                  settings: { ...form.settings, limitOneResponse: e.target.checked },
                })
              }
            />
          }
          label="Limit to one response per person"
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.settings.showProgress}
              onChange={(e) =>
                setForm({
                  ...form,
                  settings: { ...form.settings, showProgress: e.target.checked },
                })
              }
            />
          }
          label="Show progress bar"
        />
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        {formId && (
          <Typography sx={{ alignSelf: 'center', mr: 2 }}>
            Shareable Link: <Link href={getShareableLink()} target="_blank" rel="noopener">{getShareableLink()}</Link>
          </Typography>
        )}
        {formId && (
          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            onClick={previewForm}
          >
            Preview
          </Button>
        )}
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={loading}
        >
          Save Form
        </Button>
        {formId && (
          <Button
            variant={form.isPublished ? 'outlined' : 'contained'}
            color={form.isPublished ? 'warning' : 'success'}
            onClick={async () => {
              try {
                const updated = await formService.publishForm(formId, !form.isPublished);
                setForm({ ...form, isPublished: updated.is_published });
              } catch (err) {
                alert('Failed to update publish status');
              }
            }}
          >
            {form.isPublished ? 'Unpublish' : 'Publish'}
          </Button>
        )}


      </Box>
    </Box>
  );
}

export default FormBuilder
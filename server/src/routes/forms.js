const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Helper function to parse JSON fields stored as text
function parseJSONField(field) {
    try {
        return JSON.parse(field);
    } catch {
        return null;
    }
}

// Get all forms
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM forms');
        const forms = result.rows.map(form => ({
            ...form,
            // questions: parseJSONField(form.questions),
            settings: parseJSONField(form.settings)
        }));
        // console.log('Raw forms data from database:', forms); // Log the raw data
        res.json(forms);
    } catch (error) {
        console.error('Error fetching forms:', error);
        res.status(500).json({ message: 'Failed to fetch forms' });
    }
});

// Get a single form
router.get('/:id', async (req, res) => {
    try {
        const formId = parseInt(req.params.id, 10);
        if (isNaN(formId)) {
            return res.status(400).json({ message: 'Invalid form ID' });
        }
        const result = await db.query('SELECT * FROM forms WHERE id = $1', [formId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Form not found' });
        }
        const form = result.rows[0];
        console.log('.......................Raw form data from database:', form); // Log the raw data
        // form.questions = parseJSONField(form.questions);
        console.log('....................................\nQuestions: ', form.questions); // Log the raw data

        form.settings = parseJSONField(form.settings);
        res.json(form);
    } catch (error) {
        console.error('Error fetching form:', error);
        res.status(500).json({ message: 'Failed to fetch form' });
    }
});

// Create a new form
router.post('/', async (req, res) => {
    try {
        const { title, description, questions, settings, createdBy, isPublished } = req.body;
        const creator = createdBy || 'unknown';

        const result = await db.query(
            `INSERT INTO forms (title, description, questions, settings, created_by, is_published)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [title, description, JSON.stringify(questions), JSON.stringify(settings), creator, isPublished || false]
        );
        const newForm = result.rows[0];
        newForm.questions = questions;
        newForm.settings = settings;
        res.status(201).json(newForm);
    } catch (error) {
        console.error('Error creating form:', error);
        res.status(400).json({ message: 'Failed to create form' });
    }
});

// Update a form
router.put('/:id', async (req, res) => {
    try {
        const formId = parseInt(req.params.id, 10);
        if (isNaN(formId)) {
            return res.status(400).json({ message: 'Invalid form ID' });
        }
        const { title, description, questions, settings, isPublished } = req.body;

        const result = await db.query(
            `UPDATE forms SET title = $1, description = $2, questions = $3, settings = $4, is_published = $5
             WHERE id = $6 RETURNING *`,
            [title, description, JSON.stringify(questions), JSON.stringify(settings), isPublished, formId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Form not found' });
        }
        const updatedForm = result.rows[0];
        // updatedForm.questions = parseJSONField(updatedForm.questions);
        updatedForm.settings = parseJSONField(updatedForm.settings);
        res.json(updatedForm);
    } catch (error) {
        console.error('Error updating form:', error);
        res.status(400).json({ message: 'Failed to update form' });
    }
});

// Delete a form
router.delete('/:id', async (req, res) => {
    try {
        const formId = parseInt(req.params.id, 10);
        if (isNaN(formId)) {
            return res.status(400).json({ message: 'Invalid form ID' });
        }
        const result = await db.query('DELETE FROM forms WHERE id = $1 RETURNING *', [formId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.json({ message: 'Form deleted' });
    } catch (error) {
        console.error('Error deleting form:', error);
        res.status(500).json({ message: 'Failed to delete form' });
    }
});

// Publish/Unpublish a form
router.patch('/:id/publish', async (req, res) => {
    try {
        const formId = parseInt(req.params.id, 10);
        if (isNaN(formId)) {
            return res.status(400).json({ message: 'Invalid form ID' });
        }
        const { isPublished } = req.body;
        const result = await db.query(
            'UPDATE forms SET is_published = $1 WHERE id = $2 RETURNING *',
            [isPublished, formId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Form not found' });
        }
        const updatedForm = result.rows[0];
        // updatedForm.questions = parseJSONField(updatedForm.questions);
        updatedForm.settings = parseJSONField(updatedForm.settings);
        res.json(updatedForm);
    } catch (error) {
        console.error('Error updating form publish status:', error);
        res.status(400).json({ message: 'Failed to update form publish status' });
    }
});




module.exports = router;
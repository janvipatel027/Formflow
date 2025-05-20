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

// Get all responses for a form
// router.get('/form/:formId', async (req, res) => {
//     try {
//         const formId = req.params.formId;
//         const result = await db.query('SELECT * FROM responses WHERE form_id = $1', [formId]);
//         const responses = result.rows.map(response => ({
//             ...response,
//             answers
//         }));
//         console.log("Rsponses fetched successfully:", responses);
//         res.json(responses);
//     } catch (error) {
//         console.error('Error fetching responses:', error);
//         res.status(500).json({ message: 'Failed to fetch responses' });
//     }
// });

router.get('/form/:formId', async (req, res) => {
    try {
        const formId = req.params.formId;
        if (!formId) {
            return res.status(400).json({ message: 'Form ID is required' });
        }
        // If form_id is integer, parse it
        // const parsedFormId = isNaN(parseInt(formId, 10)) ? formId : parseInt(formId, 10);

        const result = await db.query('SELECT * FROM responses WHERE form_id = $1', [formId]);
        const responses = result.rows.map(response => ({
            ...response
        }));
        console.log("Responses fetched successfully:", responses);
        res.json(responses);
    } catch (error) {
        console.error('Error fetching responses:', error);
        res.status(500).json({ message: 'Failed to fetch responses' });
    }
});

// Get a single response
router.get('/:id', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM responses WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Response not found' });
        }
        const response = result.rows[0];
        response.answers = parseJSONField(response.answers);
        res.json(response);
    } catch (error) {
        console.error('Error fetching response:', error);
        res.status(500).json({ message: 'Failed to fetch response' });
    }
});

// Submit a new response
router.post('/', async (req, res) => {
    try {
        // Check if form exists and is published
        const formResult = await db.query('SELECT * FROM forms WHERE id = $1', [req.body.formId]);
        if (formResult.rows.length === 0) {
            return res.status(404).json({ message: 'Form not found' });
        }
        const form = formResult.rows[0];
        if (!form.is_published) {
            return res.status(403).json({ message: 'Form is not accepting responses' });
        }

        // Check for duplicate responses if limitOneResponse is enabled
        const formSettings = parseJSONField(form.settings);
        if (formSettings && formSettings.limitOneResponse && req.body.respondentEmail) {
            const existingResponseResult = await db.query(
                'SELECT * FROM responses WHERE form_id = $1 AND respondent_email = $2',
                [req.body.formId, req.body.respondentEmail]
            );
            if (existingResponseResult.rows.length > 0) {
                return res.status(400).json({ message: 'You have already submitted a response' });
            }
        }

        const { formId, answers, respondentEmail, startTime } = req.body;
        const userAgent = req.headers['user-agent'];
        const ipAddress = req.ip;
        const endTime = new Date();

        // Ensure each answer has a questionId field
        const answersWithIds = answers.map((answer, index) => ({
            questionId: answer.questionId || answer.id || `q${index}`,
            type: answer.type,
            value: answer.value,
            timestamp: answer.timestamp || new Date(),
        }));

        const result = await db.query(
            `INSERT INTO responses (form_id, answers, respondent_email, ip_address, user_agent, start_time, end_time)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [formId, JSON.stringify(answersWithIds), respondentEmail, ipAddress, userAgent, startTime, endTime]
        );
        const newResponse = result.rows[0];
        newResponse.answers = answersWithIds;
        res.status(201).json(newResponse);
    } catch (error) {
        console.error('Error submitting response:', error);
        res.status(400).json({ message: 'Failed to submit response' });
    }
});

// Delete a response
router.delete('/:id', async (req, res) => {
    try {
        const result = await db.query('DELETE FROM responses WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Response not found' });
        }
        res.json({ message: 'Response deleted' });
    } catch (error) {
        console.error('Error deleting response:', error);
        res.status(500).json({ message: 'Failed to delete response' });
    }
});

// Get response statistics for a form
router.get('/form/:formId/stats', async (req, res) => {
    try {
        const formId = req.params.formId;
        const result = await db.query('SELECT * FROM responses WHERE form_id = $1', [formId]);
        console.log('Received formId for stats:', req.params.formId);

        const responses = result.rows.map(response => ({
            ...response
        }));

        const stats = {
            totalResponses: responses.length,
            averageDuration: 0,
            questionStats: {}
        };

        if (responses.length > 0) {
            const totalDuration = responses.reduce((acc, curr) => {
                const start = new Date(curr.start_time);
                const end = new Date(curr.end_time);
                return acc + (end - start);
            }, 0);
            stats.averageDuration = totalDuration / responses.length;
        }

        responses.forEach(response => {
            response.answers.forEach(answer => {
                if (!stats.questionStats[answer.questionId]) {
                    stats.questionStats[answer.questionId] = {
                        totalAnswers: 0,
                        answerDistribution: {}
                    };
                }

                stats.questionStats[answer.questionId].totalAnswers++;

                if (Array.isArray(answer.value)) {
                    answer.value.forEach(val => {
                        stats.questionStats[answer.questionId].answerDistribution[val] =
                            (stats.questionStats[answer.questionId].answerDistribution[val] || 0) + 1;
                    });
                } else {
                    stats.questionStats[answer.questionId].answerDistribution[answer.value] =
                        (stats.questionStats[answer.questionId].answerDistribution[answer.value] || 0) + 1;
                }
            });
        });

        res.json(stats);
    } catch (error) {
        console.error('Error fetching response statistics:', error);
        res.status(500).json({ message: 'Failed to fetch response statistics' });
    }
});


// router.get('/form/:formId/stats', async (req, res) => {
//     try {
//         const formId = req.params.formId;

//         // Get form questions
//         const formResult = await db.query('SELECT questions FROM forms WHERE id = $1', [formId]);
//         if (formResult.rows.length === 0) {
//             return res.status(404).json({ message: 'Form not found' });
//         }

//         const questions = formResult.rows[0].questions;

//         // Get all responses
//         const result = await db.query('SELECT * FROM responses WHERE form_id = $1', [formId]);
//         const responses = result.rows.map(response => ({
//             ...response,
//             answers: parseJSONField(response.answers),
//         }));

//         const stats = {
//             totalResponses: responses.length,
//             averageDuration: 0,
//             questionStats: {},
//         };

//         if (responses.length > 0) {
//             const totalDuration = responses.reduce((acc, curr) => {
//                 const start = new Date(curr.start_time);
//                 const end = new Date(curr.end_time);
//                 return acc + (end - start);
//             }, 0);
//             stats.averageDuration = totalDuration / responses.length;
//         }

//         // Initialize questionStats
//         questions.forEach((q, index) => {
//             stats.questionStats[q.title] = {
//                 type: q.type,
//                 totalAnswers: 0,
//                 answerDistribution: {},
//             };
//         });

//         // Process responses
//         responses.forEach(response => {
//             response.answers.forEach((answer, index) => {
//                 const question = questions[index];
//                 if (!question) return;

//                 const title = question.title;
//                 const stat = stats.questionStats[title];
//                 stat.totalAnswers++;

//                 // Handle checkbox (multi-option) vs others
//                 if (Array.isArray(answer)) {
//                     answer.forEach(val => {
//                         stat.answerDistribution[val] = (stat.answerDistribution[val] || 0) + 1;
//                     });
//                 } else {
//                     stat.answerDistribution[answer] = (stat.answerDistribution[answer] || 0) + 1;
//                 }
//             });
//         });

//         res.json(stats);
//     } catch (error) {
//         console.error('Error fetching response statistics:', error);
//         res.status(500).json({ message: 'Failed to fetch response statistics' });
//     }
// });



module.exports = router;
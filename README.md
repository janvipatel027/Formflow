# FormFlow - MERN Stack Form Builder

A powerful form builder application built with the MERN (MongoDB, Express.js, React.js, Node.js) stack.

## Features

- Create and manage forms with various question types
- Drag and drop question reordering
- Form response collection and analytics
- Real-time form preview
- Response statistics and visualization
- Material UI design system
- Mobile-responsive interface

## Tech Stack

- **Frontend:**
  - React.js
  - Material UI
  - React Router
  - Formik & Yup
  - Recharts
  - Axios

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - CORS

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas URI)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd formflow
\`\`\`

2. Install server dependencies:
\`\`\`bash
cd server
npm install
\`\`\`

3. Install client dependencies:
\`\`\`bash
cd ../client
npm install
\`\`\`

4. Configure environment variables:
   - Copy `.env.example` to `.env` in the server directory
   - Update MongoDB URI and other configurations

### Running the Application

1. Start the server:
\`\`\`bash
cd server
npm run dev
\`\`\`

2. Start the client:
\`\`\`bash
cd client
npm start
\`\`\`

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Forms
- GET `/api/forms` - Get all forms
- GET `/api/forms/:id` - Get a specific form
- POST `/api/forms` - Create a new form
- PUT `/api/forms/:id` - Update a form
- DELETE `/api/forms/:id` - Delete a form
- PATCH `/api/forms/:id/publish` - Publish/unpublish a form

### Responses
- GET `/api/responses/form/:formId` - Get all responses for a form
- GET `/api/responses/:id` - Get a specific response
- POST `/api/responses` - Submit a new response
- GET `/api/responses/form/:formId/stats` - Get response statistics

## Project Structure

\`\`\`
formflow/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
└── README.md
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.

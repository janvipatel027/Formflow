
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
  - postgres
  - CORS

## Database
Create the database named formflow and restore the sql file which is in the Database folder.(Formflow/Database/formflow.sql)

### Prerequisites

- Node.js (v14 or higher)
- postgres 

### Installation

1. Install server dependencies:
cd server
npm i

2. Install client dependencies:
cd ../client
npm i

### Running the Application

1. Start the server:
cd server
npm start

2. Start the client:
cd client 
npm start

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


## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request


# Placemark 1.0: Adventure Logger

A full-stack Node.js/Hapi application for tracking and sharing adventure/activity locations in Ireland. Built with a robust architecture that supports multiple database engines and secure user authentication.

[Render Deployment](https://placemark-64re.onrender.com) | [AWS EC2 Deployment](http://13.51.154.44:3000)

## Features
* **User Accounts:** Secure registration and login using JWT.
* **Placemarks:** Add, update, and delete spots.
* **Categories:** Group spots by activity (swimming, hiking, camping etc.).
* **Admin Dashbiard:** Global user and location analytics.
* **REST API:** Fully featured API with validation.
* **API Documentation:** Interactive Swagger UI.
* **Automated Testing:** Comprehensive TDD suite using Mocha and Chai.

## Tech Stack
* **Backend:** Node.js, Hapi.js
* **Database:** MongoDB Atlas, Mongoose and Firebase Cloud Firestore
* **Validation:** Joi and JWT
* **Testing:** Mocha, Chai, Axios
* **Views:** Handlebars 
* **Media:** Cloudinary (Image Management)
* **Deployment:** AWS EC2 (Ubuntu Linux) and Render

## Local Setup
1. Clone the repository: `git clone <your-repo-link>`
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory and add:
    ```env
    cookie_name=placemark_session
   cookie_password=your_long_secure_password_string
   
   # Database Connections
   db=mongodb://your_mongo_connection_string
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   FIREBASE_PRIVATE_KEY="your_firebase_private_key"
   
   # Media Management
   cloudinary_name=your_name
   cloudinary_key=your_key
   cloudinary_secret=your_secret
   ```
4. Start the server: 
    ```node
    npm run dev
    ``` 
5. Access the server at http://localhost:3000
6. View API docs at http://localhost:3000/documentation
7. Run the tests: 
    ```node
    npm run test
    ``` 

## Infrastructure & Environment Setup

### ☁️ AWS (Amazon Web Services)
- **Host:** EC2 Ubuntu T2.Micro
- **Management:** Process managed by **PM2** for 24/7 uptime and auto-restart.
- **Network:** Accessible via Static Elastic IP on Port 3000.

### 🗄️ Database (MongoDB Atlas)
- **Production DB:** Hosted on MongoDB Atlas.
- **Test DB:** A separate 'test' database is used during Mocha/Chai specs.
- **To switch to Test Mode:** Ensure `NODE_ENV=test` is set in your environment variables. Tests can change model used (memory, json, mongo, firestore) by changing `db.init("")` to mem, json, mongo or firebase.- 

### 📸 Media (Cloudinary)
- Used for image uploads within the Placemark features.
- Requires `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, and `CLOUDINARY_SECRET` in the `.env` file.

### 🔥 Firebase / Firestore
- **Auth/Data:** Configured to support Firestore as an alternative data store (Level 4 requirement).
- Requires the `serviceAccountKey.json` and `FIREBASE_PROJECT_ID` in the root folder.

## Deployment Commands
To update the live server:
1. `git pull`
2. `npm install`
3. `pm2 restart placemark`

## API Documentation
The API is structured to follow RESTful principles. All endpoints (except login/signup) require a JWT token in the Authorization header.
* POST /api/users/authenticate: Login to receive a JWT.
* GET /api/placemarks: Retrieve all placemarks (Admin user only).
* POST /api/placemarks: Create a new adventure spot.
* DELETE /api/placemarks/{id}: Remove a specific spot.

## Database Configuration

### Mongo Atlas Initialization
The application uses **Mongoose** to connect to MongoDB Atlas. 
- **Production:** The server connects via the `MONGODB_URI` provided in the `.env` file. Upon first start, the database is automatically seeded with default users and placemarks (see `src/models/db.js`).
- **Development:** Ensure your IP is whitelisted in the Mongo Atlas Network Access settings.

### Unit Testing (Mocha & Chai)
The test suite is designed for isolation:
1. **Environment:** Tests force the `NODE_ENV` to `test`.
2. **Database Init:** The `placemark-service-test.js` (or equivalent) initializes a connection to a separate **test database**. 
3. **Lifecycle:** Before each test, the test database is cleared and re-seeded with a fresh test-set of data to ensure consistent results.

## Testing
Project has testing strategy for:
* Unit and Model Tests: Validate store logic for data accuracy and preventing fixture mutation.
* API testing: Validate CRUD operations via Axios HTTP requests.
* Security: Ensuring non-admin users cannot access sensitive data or API calls
* cross-env NODE_ENV=test: This sets the environment to "test" mode across all operating systems. It is used to make sure that seed data are not added while running tests, thus preventing corruption of the tests.

## User and Admin Management
* Role-Based Access Control: Distinct views and permissions for standard Users and Administrators.
* Admin Dashboard: Real-time analytics showing total user engagement and placemark distribution.
<!-- * Account Settings: Secure profile management allowing users to update credentials and Admins to promote/demote accounts. -->

## Adventure Cataloging
* Dynamic Categorization: Organise spots by activity (Hiking, Swimming, etc.).
* Image Management: Integrated image uploading supported by Cloudinary.
* Leaflet Maps: Interactive map integration. Every placemark is rendered with a custom marker based on its latitude and longitude coordinates. Dashboard contains global map of all placemarks on the site.
* Live Weather Integration: Real-time weather data and 24 hour forecasts fetched via the OpenWeatherMap API for every location.

## Git Workflow
This project follows **Git Flow**. Releases are tagged accordingly (v1.0.0 through v4.5.0).
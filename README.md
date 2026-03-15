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

## API Documentation
The API is structured to follow RESTful principles. All endpoints (except login/signup) require a JWT token in the Authorization header.
* POST /api/users/authenticate: Login to receive a JWT.
* GET /api/placemarks: Retrieve all placemarks (Admin user only).
* POST /api/placemarks: Create a new adventure spot.
* DELETE /api/placemarks/{id}: Remove a specific spot.

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


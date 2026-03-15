# Placemark 1.0: Adventure Logger

A full-stack Node.js/Hapi application for tracking and sharing adventure/activity locations in Ireland. Built with a robust architecture that supports multiple database engines and secure user authentication.

[WEBSITE](https://placemark-64re.onrender.com)

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
* **Database:** MongoDB and MongoDB Atlas, Mongoose, Cloudinary
* **Validation:** Joi
* **Testing:** Mocha, Chai, Axios
* **Views:** Handlebars 

## Local Setup
1. Clone the repository: `git clone <your-repo-link>`
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory and add:
    ```env
    cookie_name=placemark_session
    cookie_password=your_long_secure_password_string
    db=mongodb://your_mongo_connection_string
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
7. 4. Run the tests: 
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
* Unit Tests: Validate stores for data accuracy
* API testing: Validate CRUD operations
* Security: Ensuring non-admin users cannot access sensitive data or API calls

* cross-env NODE_ENV=test: This sets the environment to "test" mode in a way that works across all operating systems (Windows, Mac, and Linux). It is used to make sure that seed data are not added while running tests, thus preventing corruption of the tests.
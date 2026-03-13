# Placemark

A full-stack Node.js/Hapi application for tracking and sharing adventure/activity locations in Ireland.

[WEBSITE](https://placemark-64re.onrender.com)

## Features
* **User Accounts:** Secure registration and login using JWT.
* **Placemarks:** Add, update, and delete spots.
* **Categories:** Group spots by activity (swimming, hiking, camping etc.).
* **REST API:** Fully featured API with validation.
* **API Documentation:** Interactive Swagger UI.
* **Automated Testing:** Comprehensive TDD suite using Mocha and Chai.

## Tech Stack
* **Backend:** Node.js, Hapi.js
* **Database:** MongoDB, Mongoose
* **Validation:** Joi
* **Testing:** Mocha, Chai, Axios
* **Views:** Handlebars 

## Local Setup
1. Clone the repository: `git clone <your-repo-link>`
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory and add:
   ```env
   cookie_password=your_secure_password_here
   db=mongodb://127.0.0.1:27017/placemark?directConnection=true
   ```
4. Start the server: 
    ```node
    npm run dev
    ``` 
5. Access the server at http://localhost:3000
6. View API docs at http://localhost:3000/documentation
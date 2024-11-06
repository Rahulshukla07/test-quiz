# File structure

test-quiz
├── dist (generated after running the project in production mode)
├── src
│ ├── controllers/
│ │ ├── quizController.ts
│ │
│ ├── models/
│ │ ├── quizModel.ts
│ │
│ ├── routes/
│ │ ├── quizRoutes.ts
│ │
│ ├── server.ts
│ ├── index.ts
├── node_modules
├── .gitignore
├── README.md
├── tsconfig.json
├── jest.config.ts
├── package.json
├── package-lock.json
├── dockerfile (optional for containerization)
├── Tests
│ ├── quiz.jest.ts

// Steps to run the project.

1. Clone the repository
2. Install the dependencies: npm install
3. Make sure you have global typescript installed: if not, install it globally: npm install -g typescript
4. Run the project: npm run start || npm run dev
5. Access the project at http://localhost:5000/api/quiz
6. Run the each test case one by one.

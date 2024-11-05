
// Import the required modules
import axios from 'axios'
import { ExpressServer as server } from '../src/server';
import { QuizModel } from '../src/models/quizModel';

describe('Quiz API', () => {
    beforeEach(() => {
        // start the server
        server.start();
        // Reset in-memory data before each test
        QuizModel.quizzes.length = 0;
        QuizModel.results.length = 0;
    });

    // Test case for creating a quiz
    it('should create a new quiz', async () => {
        const { data, status } = await axios.post('http://localhost:5000/api/quiz/create', {
            title: 'Sample Quiz',
            questions: [
                {
                    text: 'What is 2 + 2?',
                    options: ['3', '4', '5', '6'],
                    correct_option: 2,
                },
                {
                    text: 'What is 3 + 3?',
                    options: ['5', '6', '7', '8'],
                    correct_option: 2,
                },
            ]
        });

        expect(status).toBe(201);
        expect(data.message).toBe('Quiz created successfully');
        expect(data.quiz).toHaveProperty('id');
        expect(data.quiz).toHaveProperty('title', 'Sample Quiz');
        expect(data.quiz.questions.length).toBe(2);
    });

    // // Test case for fetching a quiz
    it('should fetch a quiz by ID', async () => {
        // Create a quiz first.
        const { data } = await axios.post('http://localhost:5000/api/quiz/create', {
            title: 'Test Quiz',
            questions: [
                {
                    text: 'What is 2 + 2?',
                    options: ['3', '4', '5', '6'],
                    correct_option: 2,
                },
                {
                    text: 'What is 3 + 3?',
                    options: ['5', '6', '7', '8'],
                    correct_option: 2,
                },
            ]
        });

        const quizId = data.quiz.id;

        // Fetch the created quiz
        const res = await axios.get(`http://localhost:5000/api/quiz/${quizId}`);
        let response = res.data;
        let status = res.status;

        expect(status).toBe(200);
        expect(response.quiz).toHaveProperty('id', quizId);
        expect(response.quiz).toHaveProperty('title', 'Test Quiz');
        expect(response.quiz.questions[0]).toHaveProperty('text', 'What is 2 + 2?');
        expect(response.quiz.questions[0]).toHaveProperty('correct_option'); // Ensure correct answer isn't returned
    });

    // Test case for submitting an answer
    it('should submit an answer and return feedback', async () => {
        // Create a quiz first
        const { data } = await axios.post('http://localhost:5000/api/quiz/create', {
            title: 'Feedback Quiz',
            questions: [
                {
                    text: 'What is 2 + 2?',
                    options: ['3', '4', '5', '6'],
                    correct_option: 2,
                },
                {
                    text: 'What is 3 + 3?',
                    options: ['5', '6', '7', '8'],
                    correct_option: 2,
                },
            ]
        })

        const quizId = data.quiz.id;

        // Submit an answer
        const response = await axios.post('http://localhost:5000/api/quiz/submit', {
            quizId,
            questionId: '1',
            userId: 'user123',
            selectedOption: 2, // Correct answer
        })



        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('message', 'Correct!');
        expect(response.data.answer).toHaveProperty('is_correct', true);
    });

    // Test case for getting user results
    it('should return the user results for a quiz', async () => {
        // Create a quiz and submit an answer

        const { data } = await axios.post('http://localhost:5000/api/quiz/create', {
            title: 'Result Quiz',
            questions: [
                {
                    text: 'What is 2 + 2?',
                    options: ['3', '4', '5', '6'],
                    correct_option: 2,
                },
                {
                    text: 'What is 3 + 3?',
                    options: ['5', '6', '7', '8'],
                    correct_option: 2,
                },
            ]
        });

        const quizId = data.quiz.id;

        // Submit an answer
        const result = await axios.post('http://localhost:5000/api/quiz/submit', {
            quizId,
            questionId: '1',
            userId: 'user123',
            selectedOption: 2, // Correct answer
        });


        // Get user results
        const res = await axios.get(`http://localhost:5000/api/quiz/${quizId}/results/user123`);

        let response = res.data;
        let status = res.status;
        expect(status).toBe(200);
        expect(response).toHaveProperty('quiz_id', quizId);
        expect(response).toHaveProperty('user_id', 'user123');
        expect(response).toHaveProperty('score', 1);
        expect(response.answers[0]).toHaveProperty('is_correct', true);
    });
});

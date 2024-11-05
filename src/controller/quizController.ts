

import * as express from 'express';
import { v4 as uuidv4 } from 'uuid';
import InputValidation from '../util/inputValidation';
import { QuizModel } from '../models/quizModel';

export class QuizController {

    // Create Quiz.
    public async createQuiz(req: express.Request, res: express.Response) {
        try {

            // Validate Input.  
            let validate = InputValidation.validateCreateQuiz(req.body)
            if (!validate.isValid) {
                return res.status(400).json({ message: 'Validation Error', errors: validate.error });
            }

            // Create Quiz.
            const quiz = {
                id: uuidv4(),
                title: req.body.title,
                questions: req.body.questions.map((q, index) => ({
                    id: `${index + 1}`,
                    text: q.text,
                    options: q.options,
                    correct_option: q.correct_option,  // Index of correct option.
                })),
            };

            // Save Quiz.
            QuizModel.quizzes.push(quiz);
            res.status(201).json({ message: 'Quiz created successfully', quiz });
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }

    // Get Quiz by ID.
    public async getQuiz(req: express.Request, res: express.Response) {
        try {

            // Find Quiz by ID.
            const quiz = QuizModel.quizzes.find(q => q.id === req.params.id);

            // if Quiz not found return 404.
            if (!quiz) {
                return res.status(404).json({ message: 'Quiz not found' });
            }

            // Return Quiz.
            res.status(200).json({ quiz });
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }

    // submitAnswer.
    public async submitAnswer(req: express.Request, res: express.Response) {
        try {

            // Extract data from request body.
            const { quizId, questionId, userId, selectedOption } = req.body;

            // Find Quiz by ID.
            const quiz = QuizModel.quizzes.find((q) => q.id === quizId);
            if (!quiz) {
                return res.status(404).json({ error: 'Quiz not found' });
            }

            // Find Question by ID.
            const question = quiz.questions.find((q) => q.id === questionId);
            if (!question) {
                return res.status(404).json({ error: 'Question not found' });
            }

            // Check if the selected option is correct.
            const isCorrect = selectedOption === question.correct_option;

            // Create Answer object.
            const answer = {
                question_id: questionId,
                selected_option: selectedOption,
                is_correct: isCorrect,
            };

            // Record the result
            let userResult = QuizModel.results.find((res) => res.quiz_id === quizId && res.user_id === userId);
            if (!userResult) {
                userResult = {
                    quiz_id: quizId,
                    user_id: userId,
                    answers: [],
                    score: 0,
                };
                QuizModel.results.push(userResult);
            }
            // Check if the user has already answered this question.
            userResult.answers.push(answer);
            if (isCorrect) userResult.score += 1;

            res.status(200).json({
                message: isCorrect ? 'Correct!' : `Incorrect. The correct option is ${question.correct_option}`,
                answer,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }

    // Get Result.
    public async getResult(req: express.Request, res: express.Response) {
        try {
            // Extract data from request params.
            const { quizId, userId } = req.params;

            // Find the result.
            const result = QuizModel.results.find((r) => r.quiz_id === quizId && r.user_id === userId);

            if (!result) {
                return res.status(404).json({ error: 'Results not found' });
            }

            // Return the result.
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
}
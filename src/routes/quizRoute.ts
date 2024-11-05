
import * as express from 'express';
import { QuizController } from '../controller/quizController';


export class QuizRoute {

    public router = express.Router();
    public quizController = new QuizController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/create', this.quizController.createQuiz);
        this.router.get('/:id', this.quizController.getQuiz);
        this.router.post('/submit', this.quizController.submitAnswer);
        this.router.get('/:quizId/results/:userId', this.quizController.getResult);
    }
}


// Import Required Modules.
import express from 'express';
import cors = require('cors');
import { QuizRoute } from './routes/quizRoute';

export class ExpressServer {
    public static instance: express.Application;
    private static port: number;

    public static start() {

        this.instance = express();

        this.port = 5000;

        // Initialize Middlewares
        this.initializeMiddlewares();

        // Add controllers
        this.initializeRoutes();

        // Start Server
        let server = this.instance.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });

        return server;
    }

    private static initializeMiddlewares() {
        // CORS
        this.instance.use(
            cors({
                origin: true,
                credentials: true
            })
        );

        // Setup: Request Body Parser.
        let bodyParser = require('body-parser');
        // Parse JSON Body.
        this.instance.use(bodyParser.json({
            limit: '10mb'
        }));

    }

    private static initializeRoutes() {
        this.instance.use('/api/quiz', new QuizRoute().router);
    }
}
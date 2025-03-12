import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ITriviaQuestion } from './api.service';
import { DatabaseService } from './database.service';

export interface IAnswer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  correct: boolean;
}

export interface IResult {
  category: string;
  difficulty: string;
  score: number;
  totalQuestions: number;
}

export interface IQuizz {
  questions: ITriviaQuestion[];
  currentQuestionIndex: number;
  score: number;
  category: string;
  difficulty: string;
  totalQuestions: number;
  answers: IAnswer[];
  gameIsOver: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class QuizzService {
  private _initialState: IQuizz = {
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    category: "",
    difficulty: "",
    totalQuestions: 0,
    answers: [],
    gameIsOver: false,
  };

  private _gameState = new BehaviorSubject<IQuizz>(this._initialState);

  constructor(private _dbService: DatabaseService) { }

  getGameState(): Observable<IQuizz> {
    return this._gameState.asObservable();
  }

  initGame(questions: ITriviaQuestion[], category: string, difficulty: string) {
    this._gameState.next({
      ...this._initialState,
      questions,
      category,
      difficulty,
      totalQuestions: questions.length,
    });
  }

  submitAnswer(answer: string) {
    const currentState = this._gameState.value;
    const currentQuestion = currentState.questions[currentState.currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correct_answer;

    const newScore = isCorrect ? currentState.score + 1 : currentState.score;

    const answers: IAnswer[] = [...currentState.answers, {
      question: currentQuestion.question,
      userAnswer: answer,
      correctAnswer: currentQuestion.correct_answer,
      correct: isCorrect,
    }];

    const isLastQuestion = currentState.currentQuestionIndex === currentState.questions.length - 1;

    this._gameState.next({
      ...currentState,
      currentQuestionIndex: isLastQuestion ? currentState.currentQuestionIndex : currentState.currentQuestionIndex + 1,
      score: newScore,
      answers,
      gameIsOver: isLastQuestion,
    });

    if (isLastQuestion) {
      this._saveGameResult({
        category: currentState.category,
        difficulty: currentState.difficulty,
        score: newScore,
        totalQuestions: currentState.totalQuestions,
      });
    }

    return {
      isCorrect,
      isLastQuestion,
      correct_answer: currentQuestion.correct_answer,
    };
  }

  private async _saveGameResult(result: IResult) {
    await this._dbService.addToHistory({ ...result, total_questions: result.totalQuestions, });
    this._gameState.next(this._initialState);
  }
}

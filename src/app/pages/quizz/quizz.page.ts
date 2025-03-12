import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonItem, IonProgressBar, IonRadio, IonRadioGroup, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ApiService, ITriviaQuestion } from 'src/app/services/api.service';
import { QuizzService } from 'src/app/services/quizz.service';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.page.html',
  styleUrls: ['./quizz.page.scss'],
  standalone: true,
  imports: [IonProgressBar, IonItem, IonRadio, IonRadioGroup, IonCardSubtitle, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class QuizzPage implements OnInit {
  questions: ITriviaQuestion[] = [];
  currentQuestionIndex: number = 0;

  selectedAnswer: string = "";
  selectedAnswerIsCorrect: boolean = false;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _api: ApiService,
    private _quizzService: QuizzService,
    private _router: Router,
  ) { }

  ngOnInit() {
    const { amount, category, difficulty } = this._activatedRoute.snapshot.queryParams;

    this._api.getQuestions(amount, category, difficulty).subscribe({
      next: (data) => {
        this.questions = data;
        this._quizzService.initGame(data, category, difficulty);
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  submitAnswer(event: CustomEvent) {
    if (this.selectedAnswer !== "") return;

    const answer = event.detail.value;
    const { isCorrect, } = this._quizzService.submitAnswer(answer);

    this.selectedAnswer = answer;
    this.selectedAnswerIsCorrect = isCorrect;

    this._nextQuestion();
  }

  private _nextQuestion() {
    this._quizzService.getGameState().subscribe({
      next: (data) => {
        if (!data.gameIsOver) {
          setTimeout(() => {
            this.selectedAnswer = "";
            this.currentQuestionIndex = data.currentQuestionIndex;
          }, 3000);
        } else {
          const stringifiedParams = JSON.stringify(data);
          this._router.navigate(["results"], {
            queryParams: {
              params: stringifiedParams,
            }
          });
        }
      }
    });
  }
}

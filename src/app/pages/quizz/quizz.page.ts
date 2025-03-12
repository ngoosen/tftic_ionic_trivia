import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonItem, IonRadio, IonRadioGroup, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ApiService, ITriviaQuestion } from 'src/app/services/api.service';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.page.html',
  styleUrls: ['./quizz.page.scss'],
  standalone: true,
  imports: [IonItem, IonRadio, IonRadioGroup, IonCardSubtitle, IonButton, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class QuizzPage implements OnInit {
  questions: ITriviaQuestion[] = [];
  currentQuestionIndex: number = 0;

  selectedAnswer: string = "";
  selectedAnswerIsCorrect: boolean = false;
  correctAnswersNumber = 0;

  constructor(private _activatedRoute: ActivatedRoute, private _api: ApiService) { }

  ngOnInit() {
    const params = this._activatedRoute.snapshot.queryParams;
    this._api.getQuestions(params["amount"], params["category"], params["difficulty"]).subscribe({
      next: (data) => {
        this.questions = data;
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  submitAnswer(event: CustomEvent) {
    if (this.selectedAnswer !== "") return;
    const answer = event.detail.value;

    this.selectedAnswer = answer;
    this.selectedAnswerIsCorrect = answer === this.questions[this.currentQuestionIndex].correct_answer;

    this._nextQuestion();
  }

  private _nextQuestion() {
    if (this.questions[this.currentQuestionIndex + 1]) {
      if (this.selectedAnswerIsCorrect) {
        this.correctAnswersNumber++;
      }

      setTimeout(() => {
        this.selectedAnswer = "";
        this.selectedAnswerIsCorrect = false;
        this.currentQuestionIndex++;
      }, 3000);
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ApiService, ITriviaQuestion } from 'src/app/services/api.service';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.page.html',
  styleUrls: ['./quizz.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class QuizzPage implements OnInit {
  questions: ITriviaQuestion[] = [];

  constructor(private _activatedRoute: ActivatedRoute, private _api: ApiService) { }

  ngOnInit() {
    const params = this._activatedRoute.snapshot.queryParams;
    this._api.getQuestions(params["amount"], params["category"], params["difficulty"]).subscribe({
      next: (data) => {
        console.log("🚀 ~ QuizzPage ~ this._api.getQuestions ~ data:", data);
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

}

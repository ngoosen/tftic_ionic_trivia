import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonBadge, IonButton, IonCard, IonCardContent, IonCardHeader, IonContent, IonHeader, IonItem, IonLabel, IonList, IonListHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ApiService } from 'src/app/services/api.service';
import { IQuizz } from 'src/app/services/quizz.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
  standalone: true,
  imports: [IonButton, IonBadge, IonLabel, IonListHeader, IonItem, IonList, IonCardContent, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ResultsPage implements OnInit {
  gameState!: IQuizz;
  category: string = "";

  constructor(private _activatedRoute: ActivatedRoute, private _api: ApiService) { }

  ngOnInit() {
    const params = this._activatedRoute.snapshot.queryParams;
    this.gameState = JSON.parse(params["params"]);

    this._api.getCategories().subscribe({
      next: (data) => {
        this.category = data.trivia_categories.filter(category => category.id === parseInt(this.gameState.category))[0].name;
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ApiService } from 'src/app/services/api.service';
import { DatabaseService, IGame } from 'src/app/services/database.service';
import { fakeData } from 'src/lib/fakeHistory.data';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [IonCardSubtitle, IonBadge, IonLabel, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonItem, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HistoryPage implements OnInit {
  categories: { id: number, name: string }[] = [];
  gameHistory: IGame[] = [];

  constructor(private _api: ApiService, private _dbService: DatabaseService) { }

  ngOnInit() {
    this._api.getCategories().subscribe({
      next: (data) => {
        this.categories = data.trivia_categories;
      },
      error: (e) => {
        console.log(e);
      }
    });

    this._dbService.getHistory()
      .then((data) => {
        this.gameHistory = data.values ?? [];
      })
      .catch((error) => {
        console.log(error);
        this.gameHistory = fakeData;
      });
  }

  getCategoryName(id: string) {
    const category = this.categories.filter(c => c.id === parseInt(id))

    if (category && category.length > 0) {
      return category[0].name
    }

    return "";
  }

  getDate(timestamp: number) {
    const date = new Date(timestamp * 1000);
    return date;
  }

  getPercentage(score: number, total: number) {
    return score / total * 100;
  }
}

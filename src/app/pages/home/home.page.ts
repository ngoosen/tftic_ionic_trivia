import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonRange, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonLabel, IonButton, IonRange, IonSelect, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSelectOption, IonItem]
})
export class HomePage implements OnInit {
  categories: { id: number, name: string }[] = [];

  selectedCategory!: string;
  selectedDifficulty!: string;
  selectedAmount: number = 5;

  constructor(private _api: ApiService) { }

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this._api.getCategories().subscribe({
      next: (data) => {
        this.categories = data.trivia_categories;
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  changeCategory(event: CustomEvent) {
    this.selectedCategory = event.detail.value;
  }

  changeDifficulty(event: CustomEvent) {
    this.selectedDifficulty = event.detail.value;
  }

  changeAmount(event: CustomEvent) {
    this.selectedAmount = parseInt(event.detail.value);
  }

  startGame() {
    this._api.getQuestions(this.selectedAmount, this.selectedCategory, this.selectedDifficulty).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
}

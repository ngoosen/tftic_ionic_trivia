import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ITriviaQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: string[];
}

export interface ITriviaResponse {
  response_code: number;
  results: ITriviaQuestion[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private URL: string = "https://opentdb.com/api.php";

  constructor(private _http: HttpClient) { }

  getQuestions(amount: number, category?: string, difficulty?: string): Observable<ITriviaQuestion[]> {
    let url = `${this.URL}?amount=${amount}`;

    if (category) {
      url += `&category=${category}`;
    }

    if (difficulty) {
      url += `&difficulty=${difficulty}`;
    }

    return this._http.get<ITriviaResponse>(url).pipe(
      map(response => {
        return response.results.map(question => {
          const allAnswers = [...question.incorrect_answers, question.correct_answer];

          this._shuffleArray(allAnswers);

          return {
            ...question,
            all_answers: allAnswers,
            question: this._decodeHtml(question.question),
            correct_answer: this._decodeHtml(question.correct_answer),
            incorrect_answers: question.incorrect_answers.map(answer => this._decodeHtml(answer)),
          };
        });
      })
    );
  }

  private _shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const rIndex = Math.floor(Math.random() * (i + 1));
      [array[i], array[rIndex]] = [array[rIndex], array[i]];
    }
  }

  private _decodeHtml(html: string): string {
    const text = document.createElement("textarea");
    text.innerHTML = html;
    return text.value;
  }

  getCategories() {
    return this._http.get<{ trivia_categories: { id: number, name: string, }[] }>(`https://opentdb.com/api_category.php`);
  }
}

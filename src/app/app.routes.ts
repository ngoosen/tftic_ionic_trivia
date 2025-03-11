import { Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "home",
      },
      {
        path: "home",
        loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'quizz',
        loadComponent: () => import('./pages/quizz/quizz.page').then( m => m.QuizzPage)
      },
      {
        path: 'results',
        loadComponent: () => import('./pages/results/results.page').then( m => m.ResultsPage)
      },
      {
        path: 'history',
        loadComponent: () => import('./pages/history/history.page').then( m => m.HistoryPage)
      },
    ]
  },
];

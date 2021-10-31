import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MovieOverviewComponent } from './components/movies/movie-overview/movie-overview.component';
import { SearchmovieComponent } from './components/movies/searchmovie/searchmovie.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movie/:id', component: MovieOverviewComponent },
  { path: 'buscar/:movie', component: SearchmovieComponent },
  { path: 'panel', component: DashboardComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }, // redirect to `first-component`
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

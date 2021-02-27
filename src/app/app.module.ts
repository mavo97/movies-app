import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// Angular material
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Components
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { TrendingsSliderComponent } from './components/movies/trendings-slider/trendings-slider.component';

// Libraries
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MoviePosterComponent } from './components/shared/movie-poster/movie-poster.component';
import { ImageSrcPipe } from './pipes/image-src.pipe';

// Traduccion al español
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { MovieOverviewComponent } from './components/movies/movie-overview/movie-overview.component';
registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    TrendingsSliderComponent,
    MoviePosterComponent,
    ImageSrcPipe,
    MovieOverviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatMenuModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    MatSelectModule,
    MatProgressBarModule,
    SlickCarouselModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }],
  bootstrap: [AppComponent],
})
export class AppModule {}

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
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

// Components
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { TrendingsSliderComponent } from './components/movies/trendings-slider/trendings-slider.component';
import { MovieOverviewComponent } from './components/movies/movie-overview/movie-overview.component';
import { DialogVideoComponent } from './components/shared/dialog-video/dialog-video.component';
import { WhatsAppButtonComponent } from './components/shared/whats-app-button/whats-app-button.component';
import { SearchmovieComponent } from './components/movies/searchmovie/searchmovie.component';

// Libraries
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MoviePosterComponent } from './components/shared/movie-poster/movie-poster.component';

//Pipes
import { VideoYoutubePipe } from './pipes/video-youtube.pipe';
import { ImageSrcPipe } from './pipes/image-src.pipe';

// Traduccion al español
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { LoadingcomponentComponent } from './components/shared/loadingcomponent/loadingcomponent.component';

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
    DialogVideoComponent,
    VideoYoutubePipe,
    WhatsAppButtonComponent,
    LoadingcomponentComponent,
    SearchmovieComponent,
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
    MatDividerModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    SlickCarouselModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }],
  bootstrap: [AppComponent],
})
export class AppModule {}

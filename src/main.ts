import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './app/core/interceptors/token.interceptor';

bootstrapApplication(AppComponent,{
  providers: [
    ...appConfig.providers,
    provideHttpClient(
      withInterceptors([
        tokenInterceptor
      ])
    ),
  ]
 })
  .catch((err) => console.error(err));

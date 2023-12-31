import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModule } from './app.module';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { UniversalInterceptor } from './core/interceptors/universal.interceptor';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UniversalInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}

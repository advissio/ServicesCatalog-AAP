// Angular core modules
import { BrowserModule }       from '@angular/platform-browser';
import {
  NgModule,
  APP_INITIALIZER
}                              from '@angular/core';
import { FormsModule }         from '@angular/forms';
import {
  HttpModule,
  RequestOptions,
  XHRBackend,
  Http
}                              from '@angular/http';
import {
  HttpClientModule,
  HttpClient
}                              from '@angular/common/http';
import { Router }              from '@angular/router';

// Routes
import { AppRoutingModule }    from './app-routing.module';

// Modules
import { AppComponent }        from './app.component';
import { AuthModule }          from './auth/auth.module';
import { ProductsModule }      from './products/products.module';
import { HttpServiceModule }   from './shared/asyncServices/http/http.module';
import { UtilityModule}        from './shared/utility';

// Store
import { store }               from './shared/store';

// Effects
import { AuthEffects }         from './shared/store/effects/auth.effect';
import { ProductsEffects }     from './shared/store/effects/products.effect';

// Guards
import { AuthGuard }           from './shared/guards/auth.guard';
import { CanDeactivateGuard }  from './shared/guards/canDeactivate.guard';

// Services
import { ConfigService }       from './app-config.service';

// Third party libraries
import { StoreModule }         from '@ngrx/store';
import { EffectsModule }       from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
  TranslateModule,
  TranslateLoader
// AV ,  TranslateStaticLoader
}                              from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateService }    from '@ngx-translate/core';
import {
  SimpleNotificationsModule,
  NotificationsService
}                              from 'angular2-notifications';
import { NgxDatatableModule }  from '@swimlane/ngx-datatable';

/**
 * Calling functions or calling new is not supported in metadata when using AoT.
 * The work-around is to introduce an exported function.
 *
 * The reason for this limitation is that the AoT compiler needs to generate the code that calls the factory
 * and there is no way to import a lambda from a module, you can only import an exported symbol.
 */

export function configServiceFactory (config: ConfigService) {
  return () => config.load();
}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // Angular core dependencies
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,

    // Third party modules
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    SimpleNotificationsModule.forRoot(),
    NgxDatatableModule,

    // App custom dependencies
    HttpServiceModule.forRoot(),
    UtilityModule.forRoot(),

    ProductsModule,
    AuthModule,
    AppRoutingModule,

    /**
     * StoreModule.provideStore is imported once in the root module, accepting a reducer
     * function or object map of reducer functions. If passed an object of
     * store, combineReducers will be run creating your application
     * meta-reducer. This returns all providers for an @ngrx/store
     * based application.
     */
    StoreModule.forRoot(store),

    /**
     * Store devtools instrument the store retaining past versions of state
     * and recalculating new states. This enables powerful time-travel
     * debugging.
     * 
     * To use the debugger, install the Redux Devtools extension for either
     * Chrome or Firefox
     * 
     * See: https://github.com/zalmoxisus/redux-devtools-extension
     */
    StoreDevtoolsModule.instrument(),

    /**
     * EffectsModule.run() sets up the effects class to be initialized
     * immediately when the application starts.
     *
     * AV ex 
     *  ... .run(AuthEffects)
     *  ... .run(ProductsEffects)
     * See: https://github.com/ngrx/effects/blob/master/docs/api.md#run
     */
    EffectsModule.forRoot([AuthEffects]),
    EffectsModule.forRoot([ProductsEffects])
  ],
  providers: [
    AuthGuard,
    CanDeactivateGuard,
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: configServiceFactory,
      deps: [ConfigService], 
      multi: true
    },
    HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
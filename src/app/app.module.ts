import { NgModule ,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule,IsAdmin } from './app-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {APP_BASE_HREF} from '@angular/common';

@NgModule({
	declarations: [AppComponent],
	imports: [ BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, NgxDatatableModule ],
	providers: [
		IsAdmin,
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		{ provide: APP_BASE_HREF, useValue: '/admin/complaint' }
	],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
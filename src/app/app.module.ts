import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// peticiones http
import {HttpClientModule} from '@angular/common/http';
//firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
// lenguage
import localeCO from '@angular/common/locales/es-CO';
import localeCOExtra from '@angular/common/locales/extra/es-CO';
import { registerLocaleData } from '@angular/common';
// plugins
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { LoginGuard } from './celador/login.guard';
import { GruposComponent } from './components/grupos/grupos.component';
import { ConsejoComponent } from './components/consejo/consejo.component';
import { TypeUserComponent } from './components/type-user/type-user.component';
import { ChatPage } from './pages/chat/chat.page';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { PopMascotaComponent } from './components/pop-mascota/pop-mascota.component';
import { IonicRatingModule } from 'ionic4-rating';
import { EventComponent } from './components/event/event.component';

export const firebaseConfig = {
  apiKey: "AIzaSyBVY89FFlPr00IH6TuWsszn0CgpFn0ZkA0",
  authDomain: "gag-6f2a5.firebaseapp.com",
  databaseURL: "https://gag-6f2a5.firebaseio.com",
  projectId: "gag-6f2a5",
  storageBucket: "gag-6f2a5.appspot.com",
  messagingSenderId: "645855939410"
};
registerLocaleData(localeCO,'es',localeCOExtra);

@NgModule({
  declarations: [AppComponent,GruposComponent,PopMascotaComponent,
    ConsejoComponent,TypeUserComponent,ChatPage,UpdateUserComponent,
    EventComponent
  ],
  entryComponents: [GruposComponent,UpdateUserComponent,PopMascotaComponent,
    ConsejoComponent,TypeUserComponent,ChatPage,EventComponent],
  imports: [BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    HttpClientModule,
    IonicRatingModule,
    AngularFireAuthModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule],
    providers: [
      StatusBar,
      SplashScreen,
      InAppBrowser,
      Geolocation,
      ImagePicker,
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ],
  bootstrap: [AppComponent]
})
export class AppModule {}

// Biblioteca
import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material.module';
import { RouterModule }   from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Componentes
import { AppComponent } from './app.component';
import { DashboardScreenComponent } from './screens/dashboard-screen/dashboard-screen.component';
import { AuthScreenComponent } from './screens/auth-screen/auth-screen.component';
import { DashboardService } from './servicos/dashboard.service';
import { PostScreenComponent } from './screens/post-screen/post-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardScreenComponent,
    AuthScreenComponent,
    PostScreenComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule.forRoot([
      {path: '', component: AuthScreenComponent},
      {path: 'dashboard', component: DashboardScreenComponent},
      {path: '**', redirectTo: ''},
    ]),
    FormsModule,
    HttpClientModule
  ],
  providers: [DashboardService],
  bootstrap: [AppComponent]
})
export class AppModule { }

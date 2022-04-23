import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HdWalletAdapterModule } from '@heavy-duty/wallet-adapter';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExampleComponent } from './example/example.component';

@NgModule({
  declarations: [
    AppComponent,
    ExampleComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HdWalletAdapterModule.forRoot({autoConnect: true}),
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

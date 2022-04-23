import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderBookComponent } from './order-book/order-book.component';

const routes: Routes = [
  { path: 'orderBook', component: OrderBookComponent},
  { path: '', redirectTo: '/orderBook', pathMatch: 'full' },
  { path: '**', redirectTo: '/orderBook' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

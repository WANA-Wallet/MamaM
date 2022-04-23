import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-book',
  templateUrl: './order-book.component.html',
  styleUrls: ['./order-book.component.css']
})
export class OrderBookComponent implements OnInit {

  public bidsList = [
    [75.8754, 10],
    [50.0655, 8],
    [24.0614, 9],
  ];
  public asksList = [
    [101.5473, 11],
    [126.9725, 7],
    [152.2083, 9],
    [177.2546, 3],
    [202.1187, 6],
  ];

  constructor() { }

  ngOnInit(): void {
  //  每五秒呼叫一次
  }

}

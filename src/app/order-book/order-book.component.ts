import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-order-book',
    templateUrl: './order-book.component.html',
    styleUrls: ['./order-book.component.css']
})
export class OrderBookComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {
        //  每五秒呼叫一次更新報價
    }

    public mode = -1; // -1: Default Value, 0: Sell, 1: Buy
    public price = 0;
    public amount = 0;

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

    public changeMode(mode: number) {
        console.log(mode, 'changeMode')
        this.mode = mode;
    }

    public submit() {
        console.log('submit ', 'price:', this.price, 'amount:', this.amount, 'mode:', this.mode)
        if (this.price <= 0 || this.amount <= 0 || this.mode === -1){
            // 不給submit
        }
        // TODO
    }

}

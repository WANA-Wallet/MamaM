import { Component } from '@angular/core';
import { ConnectionStore, WalletStore } from '@heavy-duty/wallet-adapter';
import {
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolongWalletAdapter,
} from '@solana/wallet-adapter-wallets';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MamaM';
  constructor(
      private readonly _hdConnectionStore: ConnectionStore,
      private readonly _hdWalletStore: WalletStore,
  ) {}

  ngOnInit() {
    this._hdConnectionStore.setEndpoint('https://api.devnet.solana.com');
    this._hdWalletStore.setAdapters([
      new PhantomWalletAdapter(),
      // new SlopeWalletAdapter(),
      // new SolflareWalletAdapter(),
      // new SolongWalletAdapter(),
    ]);
  }
}
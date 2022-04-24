import { Component, OnInit } from '@angular/core'
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base'
import { ConnectionStore, WalletStore } from '@heavy-duty/wallet-adapter'
import { concatMap, defer, first, from, map, Observable, throwError } from 'rxjs'
import { Keypair, PublicKey, SystemProgram, Transaction, TransactionSignature } from '@solana/web3.js';
import { isNotNull } from '../operators';
import initializeContext from 'mamam-sdk/lib/sdk/initializeContext'
import base58 from 'bs58';
import context from 'mamam-sdk/lib/sdk/types/context';
import loadOrderbook from 'mamam-sdk/lib/sdk/utils/loadOrderbook';
import { MARKET } from 'mamam-sdk/lib/sdk/constants';

@Component({
    selector: 'app-example',
    templateUrl: './example.component.html',
    styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {
    // example
    readonly connection$ = this._connectionStore.connection$;
    readonly wallets$ = this._walletStore.wallets$;
    readonly wallet$ = this._walletStore.wallet$;
    readonly walletName$ = this.wallet$.pipe(
        map((wallet) => wallet?.adapter.name || null)
    );
    readonly ready$ = this.wallet$.pipe(
        map(
            (wallet) =>
                wallet &&
                (wallet.adapter.readyState === WalletReadyState.Installed ||
                    wallet.adapter.readyState === WalletReadyState.Loadable)
        )
    );
    readonly connected$ = this._walletStore.connected$;
    readonly publicKey$ = this._walletStore.publicKey$;
    public context = {} as context;
    public walletPubKey = {} as PublicKey;
    public anchorWallet$ = this._walletStore.anchorWallet$;
    public market$: Promise<TransactionSignature> | undefined;

    lamports = 0;
    recipient = '';

    constructor(
        private readonly _connectionStore: ConnectionStore,
        private readonly _walletStore: WalletStore
    ) {
    }

    ngOnInit(): void {
        this.reloadWallet();
        let outerThis = this;
        // repeat every 5 second
        async function repeat() {
            setTimeout(repeat, 5000);
            if (outerThis.walletPubKey) {
                let orderBook = await loadOrderbook(outerThis.context, MARKET);
                outerThis.bidsList = orderBook[0];
                outerThis.asksList = orderBook[1];
            }
        }
        repeat();
    }

    public reloadWallet() {
        this.anchorWallet$.subscribe(async wallet => {
            if (wallet) {
                this.walletPubKey = wallet.publicKey;
                this.context = await initializeContext(wallet);
                console.log('context', this.context);
            } else {
                console.warn('wallet undetected!!');
            }
        });
    }

    onConnect() {
        this.reloadWallet();
        this._walletStore.connect().subscribe();
    }

    onDisconnect() {
        this._walletStore.disconnect().subscribe();
    }

    onSelectWallet(walletName: WalletName) {
        this.reloadWallet();
        this._walletStore.selectWallet(walletName);
    }


    onSendTransaction(fromPubkey: PublicKey) {
        this.connection$
            .pipe(
                first(),
                isNotNull,
                concatMap((connection) =>
                    from(defer(() => connection.getRecentBlockhash())).pipe(
                        concatMap(({blockhash}) =>
                            this._walletStore.sendTransaction(
                                new Transaction({
                                    recentBlockhash: blockhash,
                                    feePayer: fromPubkey,
                                }).add(
                                    SystemProgram.transfer({
                                        fromPubkey,
                                        toPubkey: new PublicKey(this.recipient),
                                        lamports: this.lamports,
                                    })
                                ),
                                connection
                            )
                        )
                    )
                )
            )
            .subscribe(
                (signature) => console.log(`Transaction sent (${signature})`),
                (error) => console.error(error)
            );
    }

    onSignTransaction(fromPubkey: PublicKey) {
        this.connection$
            .pipe(
                first(),
                isNotNull,
                concatMap((connection) =>
                    from(defer(() => connection.getRecentBlockhash())).pipe(
                        map(({blockhash}) =>
                            new Transaction({
                                recentBlockhash: blockhash,
                                feePayer: fromPubkey,
                            }).add(
                                SystemProgram.transfer({
                                    fromPubkey,
                                    toPubkey: new PublicKey(this.recipient),
                                    lamports: this.lamports,
                                })
                            )
                        )
                    )
                ),
                concatMap((transaction) => {
                    const signTransaction$ =
                        this._walletStore.signTransaction(transaction);

                    if (!signTransaction$) {
                        return throwError(
                            new Error('Sign transaction method is not defined')
                        );
                    }

                    return signTransaction$;
                })
            )
            .subscribe(
                (transaction) => console.log('Transaction signed', transaction),
                (error) => console.error(error)
            );
    }

    onSignAllTransactions(fromPubkey: PublicKey) {
        this.connection$
            .pipe(
                first(),
                isNotNull,
                concatMap((connection) =>
                    from(defer(() => connection.getRecentBlockhash())).pipe(
                        map(({blockhash}) =>
                            new Array(3).fill(0).map(() =>
                                new Transaction({
                                    recentBlockhash: blockhash,
                                    feePayer: fromPubkey,
                                }).add(
                                    SystemProgram.transfer({
                                        fromPubkey,
                                        toPubkey: new PublicKey(this.recipient),
                                        lamports: this.lamports,
                                    })
                                )
                            )
                        )
                    )
                ),
                concatMap((transactions) => {
                    const signAllTransaction$ =
                        this._walletStore.signAllTransactions(transactions);

                    if (!signAllTransaction$) {
                        return throwError(
                            new Error('Sign all transactions method is not defined')
                        );
                    }

                    return signAllTransaction$;
                })
            )
            .subscribe(
                (transactions) => console.log('Transactions signed', transactions),
                (error) => console.error(error)
            );
    }

    onSignMessage() {
        const signMessage$ = this._walletStore.signMessage(
            new TextEncoder().encode('Hello world!')
        );

        if (!signMessage$) {
            return console.error(new Error('Sign message method is not defined'));
        }

        signMessage$.pipe(first()).subscribe((signature) => {
            console.log(`Message signature: ${base58.encode(signature)}`);
        });
    }

    // orderBook
    public mode = -1; // -1: Default Value, 0: Sell, 1: Buy
    public price = 0;
    public amount = 0;

    public bidsList: number[][] = [
        [75.8754, 10],
        [50.0655, 8],
        [24.0614, 9],
    ];
    public asksList: number[][] = [
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
            alert('請選擇買賣模式並輸入正確的金額及數量。');
        }
        // TODO
    }
}

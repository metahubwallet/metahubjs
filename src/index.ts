let wallet: any = null;
const metahubLoaded = () => {
    if (wallet != null) {
        return;
    }
    const win = (window as any);
    wallet = win.metahub ? win.metahub : win.scatter;
}
document.addEventListener('metahubLoaded', metahubLoaded);
document.addEventListener('scatterLoaded', metahubLoaded);

export interface NetworkAccount {
    blockchain: string;
    chainId: string;
    host: string;
    port: number;
    protocol: string;
}

export interface IdentityAccount {
    blockchain: string;
    name: string;
    publicKey: string;
    authority: string;
    chainId: string;
    isHardware: boolean;
};

export interface Identity {
    accounts: IdentityAccount[];
    kyc: boolean;
    name: string;
    publicKey: string;
    hash: string;
};

export interface Token {
    blockchain: string;
    contract: string;
    symbol: string;
    decimals: number;
}

export interface LoginOptions {
    appName?: string;
    chainId?: string;
    newLogin?: boolean;
    accounts?: NetworkAccount[];
}

class MetahubJS {
    _identity: Identity | null = null;

    public get identity(): Identity | null {
        return wallet.identity;
    }

    async connect(): Promise<boolean> {
        return new Promise(function(resolve) {
            if (wallet != null) {
                resolve(true);
            } else {
                let times = 0;
                let timer = setInterval(function(){
                    if (wallet != null || ++times == 30) {
                        clearInterval(timer);
                        resolve(wallet != null);
                    }
                }, 100);
            }
        });
    }

    async login(options: LoginOptions): Promise<Identity> {
        if (!options.appName) {
            options.appName = location ? location.host : '';
        }
        if (!options.chainId) {
            options.chainId = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';
        }
        return await wallet.login(options);
    }


    async hasAccountFor(network: NetworkAccount): Promise<boolean>  {
        return await wallet.hasAccountFor(network);
    }

    async getIdentity(options: LoginOptions): Promise<Identity>  {
        return await wallet.getIdentity(options);
    }

    async logout(account: string | undefined): Promise<Identity | null>  {
        return await wallet.logout(account);
    }

    async forgetIdentity(account: string | undefined): Promise<Identity | null>  {
        return await wallet.forgetIdentity(account);
    }

    async getIdentityFromPermissions(): Promise<Identity | null>   {
        return await wallet.getIdentityFromPermissions();
    }

    async suggestNetwork(network: NetworkAccount): Promise<void>  {
        return await wallet.suggestNetwork(network);
    }

    async addToken(token: Token): Promise<void>  {
        return await wallet.addToken(token);
    }

    async getArbitrarySignature(publicKey: string, data: string): Promise<string>  {
        return await wallet.getArbitrarySignature(publicKey, data);
    }

    eos<T>(network: NetworkAccount, Api: {new():T}, options: any): T  {
        return wallet.eos(network, Api, options) as T;
    }

    eosHook(network: NetworkAccount): any  {
        return wallet.eosHook(network);
    }

    async getVersion(): Promise<string>  {
        return await wallet.getVersion();
    }
}

export default new MetahubJS();
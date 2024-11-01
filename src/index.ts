export const EOS_CHAIN_ID = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';

let provider: any = null;
const win = (window as any);
const metahubLoaded = () => {
    if (provider != null) {
        return;
    }
    provider = win.metahub ? win.metahub : win.scatter;
}
document.addEventListener('metahubLoaded', metahubLoaded);
document.addEventListener('scatterLoaded', metahubLoaded);
if (win.metahub || win.scatter) {
    metahubLoaded();
}

export interface Network {
    blockchain: string;
    chainId: string;
    host: string;
    port: number;
    protocol: string;
}

export interface Account {
    blockchain: string;
    name: string;
    publicKey: string;
    authority: string;
    chainId: string;
    isHardware: boolean;
};

export interface Identity {
    accounts: Account[];
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

export interface ConnectOptions {
    network?: Partial<Network>;
    chainId?: string;
}

export interface LoginOptions {
    appName?: string;
    chainId?: string;
    newLogin?: boolean;
    accounts?: Network[];
}

class MetahubWallet {
    private appName: string = '';
    private network: Partial<Network> = {};

    public get identity(): Identity | null {
        return provider.identity;
    }

    async connect(appName: string = '', options: ConnectOptions = {}): Promise<boolean> {
        if (appName) {
            this.appName = appName;
        }
        if (options.network) {
            this.network = Object.assign(this.network, options.network);
        } else if (options.chainId) {
            this.network.chainId = options.chainId;
        }
        
        return new Promise(function(resolve) {
            if (provider != null) {
                resolve(true);
            } else {
                let times = 0;
                let timer = setInterval(function(){
                    if (provider != null || ++times == 30) {
                        clearInterval(timer);
                        resolve(provider != null);
                    }
                }, 100);
            }
        });
    }

    async login(options: LoginOptions = {}): Promise<Identity> {
        if (!options.appName) {
            options.appName = this.appName || (location ? location.host : '');
        }
        if (!options.chainId) {
            options.chainId = this.network && this.network.chainId ? this.network.chainId : EOS_CHAIN_ID;
        }
        return await provider.login(options);
    }


    async hasAccountFor(network: Network): Promise<boolean>  {
        return await provider.hasAccountFor(network);
    }

    async getIdentity(options: LoginOptions = {}): Promise<Identity>  {
        return await provider.getIdentity(options);
    }

    async logout(account: string | undefined = undefined): Promise<Identity | null>  {
        return await provider.logout(account);
    }

    async forgetIdentity(account: string | undefined = undefined): Promise<Identity | null>  {
        return await provider.forgetIdentity(account);
    }

    async getIdentityFromPermissions(): Promise<Identity | null>   {
        return await provider.getIdentityFromPermissions();
    }

    async suggestNetwork(network: Network): Promise<void>  {
        return await provider.suggestNetwork(network);
    }

    async addToken(token: Token): Promise<void>  {
        return await provider.addToken(token);
    }

    async getArbitrarySignature(publicKey: string, data: string): Promise<string>  {
        return await provider.getArbitrarySignature(publicKey, data);
    }

    eos<T>(network: Network, Api: { new(...args: any[]): T }, options: any): T  {
        return provider.eos(network, Api, options) as T;
    }

    eosHook(network: Network): any  {
        return provider.eosHook(network);
    }

    async getVersion(): Promise<string>  {
        return await provider.getVersion();
    }

    isMetahub(): boolean {
        return typeof provider.isMetahub == 'function' ? provider.isMetahub() : false;
    }
}

export const MetahubJS = new MetahubWallet();
export default MetahubJS;
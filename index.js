var MetahubJS = {};

(function() {
    var wallet = null;
    var methods = [
        'hasAccountFor', 'getIdentity', 'forgetIdentity', 'getIdentityFromPermissions',
        'logout', 'suggestNetwork', 'getArbitrarySignature', 'eos', 'eosHook', 'getVersion', 
    ];
    var loaded = false;
    var metahubLoaded = function() {
        if (loaded) {
            return;
        }
        wallet = window.metahub ? window.metahub : window.scatter;
        loaded = true;
    }
    document.addEventListener('metahubLoaded', metahubLoaded);
    document.addEventListener('scatterLoaded', metahubLoaded);
    var appName;
    var chainId;
    MetahubJS.connect = function(name, options) {
        appName = name;
        chainId = options.network && options.network.chainId ? options.network.chainId : 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';
        console.log({ appName: appName, chainId: chainId});
        return new Promise(function(resolve) {
            if (loaded) {
                resolve(true);
            } else {
                var times = 0;
                var timer = setInterval(function(){
                    if (loaded) {
                        clearInterval(timer);
                        resolve(true);
                    }
                    if (++times == 30) {
                        clearInterval(timer);
                        resolve(false);
                    }
                }, 100);
            }
        });
    };
    MetahubJS.login = function(options) {
        var opts = Object.assign(options || {}, { appName: appName, chainId: chainId});
        return wallet.login(opts);
    };
    Object.defineProperty(MetahubJS, 'identity', {
        enumerable: false,
        get() { 
            return wallet.identity;
        },
    });
    for (var i = 0; i < methods.length; i++) {
        var key = methods[i];
        MetahubJS[key] = (function(key){
            return function() {
                var method = wallet[key];
                return method.apply(wallet, arguments)
            };
        })(methods[i]);
    }

})();

module.exports = MetahubJS;
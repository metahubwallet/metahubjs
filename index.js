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
    MetahubJS.connect = function() {
        return new Promise(function(resolve) {
            if (loaded) {
                resolve(true);
            } else {
                var times = 0;
                var timer = setInterval(function(){
                    if (loaded || ++times == 30) {
                        clearInterval(timer);
                        resolve(loaded);
                    }
                }, 100);
            }
        });
    };
    MetahubJS.login = function(options) {
        if (!options.appName) {
            options.appName = location ? location.host : '';
        }
        if (!options.chainId) {
            options.chainId = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';
        }
        return wallet.login(options);
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
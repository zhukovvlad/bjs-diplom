'use strict';

class Person {
    constructor(username, firstName, lastName, password) {
        this.username = username;
        this.name = {firstName: firstName, lastName: lastName};
        this.password = password;
    }

    addUser() {
        console.log(`Creating ${this.username}`);
        let user = {
            username: this.username,
            name: {firstName: this.name.firstName, lastName: this.name.lastName},
            password: this.password,
        };
        let promise = new Promise((resolve, reject) => {
            ApiConnector.createUser( user, (err, data) => {
                if (err) {
                    reject(`Failed to create ${this.username}. It seems that user already exists.`);;
                } else {
                    console.log(`Created ${this.username} `);
                    resolve(data);
                }
            })
        })
        return promise;
        }

    authUser() {
        console.log(`Authorizing ${this.username}`);
        let promise = new Promise((resolve, reject) => {
            ApiConnector.performLogin({
                username: this.username,
                password: this.password,
            }, (err, data) => {
                if (err) {
                    reject(`Failed to authorize ${this.username}`);
                } else {
                    console.log(`${this.username} is authorized. `);
                    resolve(data);
                }
            })
        })
        return promise;
    }


    addMoney({currency, amount}) {
        console.log(`Adding ${amount} of ${currency} to ${this.username}`);
        let promise = new Promise((resolve, reject) => {
            ApiConnector.addMoney({currency, amount}, (err, data) => {
                if (err) {
                    reject(`Failed adding money to ${this.username}`);
                } else {
                    console.log(`Added ${amount} of ${currency} to ${this.username}.`);
                    resolve(data);
                }
            });
        })
        return promise;
    }

    convertMoney({fromCurrency, targetCurrency, fromAmount}, curr) {
        let targetAmount = curr[fromCurrency + '_' + targetCurrency] * fromAmount;
        console.log(`Converting ${fromAmount} ${fromCurrency} to ${targetAmount} ${targetCurrency}`);
        let promise = new Promise((resolve, reject) => {
            ApiConnector.convertMoney({fromCurrency, targetCurrency, targetAmount}, (err, data) => {
                if (err) {
                    reject(`Failed to convert. It seems that you have no sufficient ${fromCurrency} for exchange.`);
                } else {
                    console.log(`Successfully converted to ${targetAmount} ${targetCurrency}.`);
                    console.log(`${this.username}'s current wallet is:`)
                    for (let item in data.wallet) {
                        console.log(item + ': ' + data.wallet[item]);
                    }
                    resolve(data);
                }
            });
        })
        return promise;
    }

    transfer({to, amount}) {
        console.log(`Transfering ${amount} of Netcoins to ${to}`);
        let promise = new Promise((resolve, reject) => {
            ApiConnector.transferMoney({to, amount}, (err, data) => {
                if (err) {
                    reject('Failed to transfer');
                } else {
                    for (let coin in data.wallet) {
                        if (data.wallet.coin < 0) {
                            reject(`It seems that you have no enough ${coin} to transfer`);
                        }
                    }
                    console.log(`Successfull transfer of ${amount} NETCOINS to ${to}.`)
                    resolve(data);
                }
            });
        })
        return promise;
    }
}

    function currency () {
        console.log("Getting stocks info");
        let stocks = new Promise((resolve, reject) => {
            ApiConnector.getStocks((err, data) => {
                if (err) {
                    reject(`Failed to get currencies`);
                } else {
                    resolve(data);
                }
            });
        });
        return stocks;

    };


function main() {
    const vlad = new Person('zhukovvlad', 'Vladimir', 'Zhukov', 'qwerty');
    const petya = new Person('petro', 'Pyotr', 'Savvenkov', 'qwerty');

    vlad.addUser()
        .then(vlad.authUser.bind(vlad))
        .then(petya.addUser.bind(petya))
        .then(function() {
            return vlad.addMoney({currency: 'EUR', amount: 50000})
            })
        .then(currency)
        .then(function(data) {
            console.log('Current currency exchange:\n', data[data.length-1]);
            return vlad.convertMoney({fromCurrency: 'EUR', targetCurrency: 'NETCOIN', fromAmount: 30000}, data[data.length-1]);
            })
        .then(function() {
            return vlad.transfer({to: petya.username, amount: 100});
            })
        .catch(error => console.error(error));
}

main();
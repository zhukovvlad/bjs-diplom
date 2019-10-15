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
        console.log(curr);
        let targetAmount = curr[fromCurrency + '_' + targetCurrency] * fromAmount;
        console.log(curr[fromCurrency + '_' + targetCurrency]);
        console.log(targetAmount);
        console.log(`Converting ${fromAmount} ${fromCurrency} to ${targetAmount} ${targetCurrency}`);
        let promise = new Promise((resolve, reject) => {
            ApiConnector.convertMoney({fromCurrency, targetCurrency, targetAmount}, (err, data) => {
                if (err) {
                    reject(`Failed to convert`);
                } else {
                    console.log(`Successfully converted to coins.`);
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
        //let indexForCurrencyObject = Math.random().toFixed(2) * 100 - 1;
        let stocks = new Promise((resolve, reject) => {
            ApiConnector.getStocks((err, data) => {
                if (err) {
                    reject(`Failed to get currencies`);
                } else {
                    /*
                    let row = data[Math.random().toFixed(2) * 100 - 1];
                    console.log('Currencies loaded, ' + data[Math.random().toFixed(2) * 100 - 1]);
                    console.log(row);
                    */
                    resolve(data);
                }
            });
        });
        return stocks;

    };

//currency();

function main() {
    const vlad = new Person('zhukovvlad', 'Vladimir', 'Zhukov', 'qwerty');
    const petya = new Person('petro', 'Pyotr', 'Savvenkov', 'qwerty');

    //let stocks = currency();
    //console.log(stocks);



    vlad.addUser()
        .then(vlad.authUser.bind(vlad))
        .then(petya.addUser.bind(petya))
        .then(function() {
            return vlad.addMoney({currency: 'EUR', amount: 50000})
            })
        .then(currency)
        .then(function(data) {
            console.log(data);
            return vlad.convertMoney({fromCurrency: 'EUR', targetCurrency: 'NETCOIN', fromAmount: 10000}, data[data.length-1]);
            })
        .then(function() {
            return vlad.transfer({to: petya.username, amount: 3});
            })
        .catch(error => console.error(error));
}


main();
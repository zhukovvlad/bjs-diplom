class Person {
    constructor(username, firstName, lastName, password) {
        this.username = username;
        this.name = {firstName: firstName, lastName: lastName};
        this.password = password;
    }

    addUser() {
        console.log(`Creating ${this.username}`);
        return ApiConnector.createUser({
            username: this.username,
            name: {firstName: this.name.firstName, lastName: this.name.lastName},
            password: this.password,
        }, (err, data) => {
            //console.log(`Creating ${this.username}`);
            if (err) {
                console.log(`Failed to create ${this.username}. It seems that user already exists.`);
            } else {
                console.log(`Created ${this.username} ` + data);
                //this.authUser();
            }
        });
    }

    authUser() {
        console.log(`Authorizing ${this.username}`);
        return ApiConnector.performLogin({
            username: this.username,
            password: this.password,
        }, (err, data) => {
            if (err) {
                console.log(`Failed to authorize ${this.username}`);
            } else {
                console.log(`${this.username} is authorized. ` + data);
            }
        });
    }


    addMoney({currency, amount}) {
        return ApiConnector.addMoney({currency, amount}, (err, data) => {
            console.log(`Adding ${amount} of ${currency} to ${this.username}`);
            if (err) {
                console.log(`Failed adding money to ${this.username}`);
            } else {
                console.log(`Added ${amount} of ${currency} to ${this.username}. ${data}`);
            }
        });
    }

    convertMoney({fromCurrency, targetCurrency, targetAmount}) {
        return ApiConnector.convertMoney({fromCurrency, targetCurrency, targetAmount}, (err, data) => {
            console.log(`Converting ${fromCurrency} to ${targetAmount} ${targetCurrency}`);
            if (err) {
                console.log(`Failed to convert`);
            } else {
                console.log(`Converted to coins: ${data}`);
                for (let item in data.wallet) {
                    console.log(item + ': ' + data.wallet[item]);
                }
            }
        });
    }

    transferMoney({to, amount}) {
        return ApiConnector.transferMoney({to, amount}, (err, data) => {
            console.log(`Transfering ${amount} of Netcoins to ${to}`);
            if (err) {
                console.log('Failed to transfer');
            } else {
                console.log('Successful transfer. ' + data);
            }
        });
    }

}

const currency = () => {
    return ApiConnector.getStocks((err, data) => {
        console.log("Getting stocks info");
        if (err) {
            console.log(`Failed to get currencies`);
        } else {
            console.log('Currencies: ', data);
        }
    });
};


const vlad = new Person('zhukovvlad', 'Vladimir', 'Zhukov', 'qwerty');
const petya = new Person('petro', 'Pyotr', 'Savvenkov', 'qwerty');

currency();
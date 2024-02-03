// Data
const account1 = {
  userName: "js",
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  movementsDate: new Map([
    [200, '2018/5/28'],
    [450, '2020/3/29'],
    [-400, '2021/6/25'],
    [3000, '2021/8/18'],
    [-650, '2021/10/18'],
    [-130, '2021/10/19'],
    [70, '2021/10/20'],
    [1300, '2021/11/28'],]),
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  userName: "jd",
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  movementsDate: new Map([
    [5000, '2018/5/28'],
    [3400, '2020/3/29'],
    [-150, '2020/6/25'],
    [-790, '2020/8/18'],
    [-3210, '2020/10/18'],
    [-1000, '2020/10/19'],
    [8500, '2020/10/20'],
    [-30, '2022/11/28'], ]),
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  userName: "st",
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  movementsDate: new Map([
    [200, '2022/3/29'],
    [-200, '2022/5/28'],
    [340, '2022/6/25'],
    [-300, '2022/8/18'],
    [-20, '2022/10/18'],
    [50, '2022/10/19'],
    [400, '2022/10/20'],
    [-460, '2022/11/28'], ]),
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  userName: "ss",
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  movementsDate: new Map([
    [430, '2023/9/18'],
    [1000, '2023/9/19'],
    [700, '2023/9/20'],
    [50, '2023/9/21'],
    [90, '2023/9/22'],]),
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
// Elements
const labelWelcome = document.querySelector('.msg');
const labelDate = document.querySelector('.main-header .history');
const labelBalance = document.querySelector('.account');
const labelSumIn = document.querySelector('.cash-in .cash-val');
const labelSumOut = document.querySelector('.cash-out .cash-val');
const labelSumInterest = document.querySelector('.cash-interest .cash-val');
const labelTimer = document.querySelector('.time');
const labelPopup = document.querySelector('.popup');

const containerApp = document.querySelector('.main');
const containerMovements = document.querySelector('.main-body .left');

const btnLogin = document.querySelector('.register input[type=\'submit\']');
const btnTransfer = document.querySelector('.transfer input[type=\'submit\']');
const btnLoan = document.querySelector('.loan input[type=\'submit\']');
const btnClose = document.querySelector('.close input[type=\'submit\']');
const btnSort = document.querySelector('.sort');

const inputLoginUsername = document.querySelector('.register input[placeholder=\'user\']');
const inputLoginPin = document.querySelector('.register input[placeholder=\'PIN\']');
const inputTransferTo = document.querySelector('.transfer #tran-to');
const inputTransferAmount = document.querySelector('.transfer #tran-amount');
const inputLoanAmount = document.querySelector('.loan #ask-for');
const inputCloseUsername = document.querySelector('.close #user');
const inputClosePin = document.querySelector('.close #pin');
// Functions
const logIn = function () {
  document.forms[0].onsubmit = (e) => {
    e.preventDefault();
    inputClosePin.focus();
    inputClosePin.blur();
    users.forEach((acc) => {
      if(inputLoginUsername.value == acc.userName && inputLoginPin.value == acc.pin) {
        containerApp.style.opacity = '100%';
        labelWelcome.textContent = `Welcome ${acc.owner.split(' ')[0]}`;
        currentAccount = acc;
        labelDate.textContent = getDate().join('/');
        display(acc.movements, acc.movementsDate);
        calcCurrentBalance(acc.movements);
        displaySumIn(acc.movements);
        displaySumOut(acc.movements);
        displaySumInterset(acc.movements, acc.interestRate);
        timer();
        // Sort
        sort(false);
        inputLoginUsername.classList.add('disabled');
        inputLoginPin.classList.add('disabled');
      }
    });
    inputLoginUsername.value = inputLoginPin.value = '';
  }
};
const transfer = function () {
  document.forms[1].onsubmit = function (e) {
    e.preventDefault();
    let userAccount = users.find((user) => user.userName == inputTransferTo.value);
    if(userAccount?.userName) {
      let userMoney = currentAccount.movements.reduce((acc, cur) => acc + cur);
      if(userMoney < Number(inputTransferAmount.value) || Number(inputTransferAmount.value) == 0) {
        popup('There Is No Enough Cash !');
      }
      else if(inputTransferAmount.value <= 0) {
        popup('Invalid Cash !');
      }
      else if(inputTransferTo.value == currentAccount.userName) {
        popup('Can\'t Transfer To This Account');
      }
      // Valid Transformation
      else {
        currentAccount.movements.push(-Number(inputTransferAmount.value));
        currentAccount.movementsDate.set(-Number(inputTransferAmount.value), getDate().join('/'));
        display(currentAccount.movements, currentAccount.movementsDate);
        calcCurrentBalance(currentAccount.movements);
        displaySumOut(currentAccount.movements);
        userAccount.movements.push(Number(inputTransferAmount.value));
        userAccount.movementsDate.set(Number(inputTransferAmount.value), getDate().join('/'));
      }
    }
    else {
      popup('User Not Found');
    }
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.focus();
    inputTransferAmount.blur();
  }
};
const loan = function () {
  document.forms[2].onsubmit = function (e) {
    e.preventDefault();
    if(inputLoanAmount.value > 0) {
      currentAccount.movements.push(Number(inputLoanAmount.value));
      currentAccount.movementsDate.set(Number(inputLoanAmount.value), getDate().join('/'));
      inputLoanAmount.value = 0;
      inputLoanAmount.blur();
      display(currentAccount.movements, currentAccount.movementsDate);
      calcCurrentBalance(currentAccount.movements);
      displaySumIn(currentAccount.movements);
      displaySumInterset(currentAccount.movements, currentAccount.interestRate);
    }
    else {
      popup('Invalid Cash !');
      inputLoanAmount.value = 0;
      inputLoanAmount.blur();
    }
  }
};
const logOut = function () {
  document.forms[3].onsubmit = function (e) {
    e.preventDefault();
    if(inputCloseUsername.value == currentAccount.userName && inputClosePin.value == currentAccount.pin) {
      currentAccount = {};
      containerApp.style.opacity = 0;
      labelTimer.textContent = '00:00';
      inputLoginUsername.classList.remove('disabled');
      inputLoginPin.classList.remove('disabled');
    }
    else {
      inputCloseUsername.value != currentAccount.userName ? popup('User Name Isn\'t Valid') : popup('PIN Isn\'t Valid');
    }
    inputCloseUsername.focus();
    inputCloseUsername.blur();
    inputCloseUsername.value = inputClosePin.value = '';
  }
  timer(false, true); // There Is Started Interval, I Want To Turn It Off
};
const display = function (data, date) {
  containerMovements.replaceChildren();
  data.forEach((e, i) => {
    const type = e > 0 ? 'green' : 'red';
    const word = e > 0 ? 'DEPOSIT' : 'WITHDRAWAL';
    const html = `
    <div class="movment">
    <div>
      <span class="type ${type}"><span>${i+1} </span>${word}</span>
      <span class="history">${date.get(e)}</span>
    </div>
    <span class="money">${e}$</span>
    </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
const createUserName = function (accounts) {
  accounts.forEach(account => {
    account.userName = account.owner.toLowerCase().split(' ').map(word=>word[0]).join("");
  })
};
const calcCurrentBalance = function (movments) {
  const balacne = movments.reduce((ac, movment) => ac + movment);
  labelBalance.textContent = ``;
  labelBalance.textContent = `${balacne}$`;
};
const displaySumIn = function (movments) {
  labelSumIn.textContent = `${movments.filter(movment => movment > 0).reduce((acc, cur) => acc + cur)} $`;
};
const displaySumOut = function (movments) {
  labelSumOut.textContent = `${Math.abs(movments.filter(movment => movment < 0).reduce((acc, cur) => acc + cur))} $`;
};
const displaySumInterset = function (movments, interestRate) {
  labelSumInterest.textContent = `${movments.filter(movment => movment > 0).map(value => (value * interestRate) / 100).filter(interseted => interseted > 1).reduce((acc, value) => acc + value).toFixed(2)} $`;
};
const popup = function (subject) { 
  labelPopup.textContent = subject;
  labelPopup.style.opacity = 100;
  setTimeout(() => {
    labelPopup.style.opacity = 0;
  }, 2000);
};
const timer = function (start = true, condition = false) { // Condition Like Start Or Finish, Start Variable For Start Interval
  let close;
  if(start) {
    close = setInterval(() => { // 05:00
      let currentTime = labelTimer.textContent.split(':');
      if(Number(currentTime[1]) > 0) {
        labelTimer.textContent = `${currentTime[0]}:${ currentTime[1] > 10 ? Number(currentTime[1])-1 : `0${Number(currentTime[1])-1}`}`;
      }
      else if (Number(currentTime[0]) > 0){
        labelTimer.textContent = `0${Number(currentTime[0])-1}:${59}`;
      }
      else {
        currentAccount = {};
        containerApp.style.opacity = 0;
        clearInterval(close);
        labelTimer.textContent = `05:00`;
        inputLoginUsername.classList.remove('disabled');
        inputLoginPin.classList.remove('disabled');
      }
    }, 1000);
    start = false;
  }
  if(condition) {
    clearInterval(close);
  }
};
const sort = function (sorted) {
  let arrow = '↓';
  btnSort.onclick = function () {
    if(!sorted) {
      let movements = [...currentAccount.movements];
      display(movements.sort((a, b) => a - b), currentAccount.movementsDate);
      sorted = !sorted;
      arrow == '↓' ? arrow = '↑' : arrow = '↓';
      btnSort.textContent = `${arrow} SORT`;
    }
    else {
      let movements = [...currentAccount.movements];
      display(movements.sort((a, b) => b - a), currentAccount.movementsDate);
      sorted = !sorted;
      arrow == '↓' ? arrow = '↑' : arrow = '↓';
      btnSort.textContent = `${arrow} SORT`;
    }
  }
};
const getDate = function () {
  months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  let theDate = new Date();
  return [theDate.getDate(), months[theDate.getMonth()], theDate.getFullYear()]
};
// Main
const users = [account1, account2, account3, account4];
let currentAccount = {};
createUserName(users);
// Log In
logIn();
// Transfer Cash
transfer();
// Request Ioan
loan();
// Close Account
logOut();


// Delete The Account !

// document.forms[3].onsubmit = function (e) {
//   e.preventDefault();
//   if(currentAccount.userName == inputCloseUsername.value && currentAccount.pin == inputClosePin.value) {
//     users.splice(users.findIndex((value) => value.userName == inputCloseUsername.value),1);
//     currentAccount = {};
//     containerApp.style.opacity = 0;
//     labelTimer.textContent = '00:00';
//     inputLoginUsername.classList.remove('disabled');
//     inputLoginPin.classList.remove('disabled');
//   }
// }

// Calc OverAll Movments
// let sum = 0;
// users.forEach((acc) => {
//   sum += acc?.movements.reduce((acc, cur) => acc + cur);
// });
// console.log(users);
// console.log(sum);
// // The New Function Go In Depth One With Map Function
// console.log(users.flatMap((user) => user = user.movements).reduce((acc, arr) => acc + arr));
// // The New Function Without Map
// console.log(users.map((ele) => ele.movements).flat().reduce((acc, arr) => acc + arr));
// // Flat Is Transfer All Sub-array Into Elements Inside The Array

// Formating Inti API

// const myDate = new Date('10/10/2020');
// const currentReadableDate = myDate.toISOString();
// console.log(currentReadableDate);
// console.log(myDate);
// console.log(new Date())

// Number As M.sec From 1/1/1970 Till Now

// let date1 = new Intl.DateTimeFormat('en-US').format(myDate.getTime());

// Date As '1/12/2019' But Not A String It Must Be Date
// Search For 'Locales' Or 'ISO Language Table'

// let date2 = new Intl.DateTimeFormat('en-US').format(new Date('10/10/2010'));
// console.log(date1);
// console.log(date2);
// console.log(new Date('10/10/2010'));

// Optional Object

// const objDate = {
//   hour: 'numeric',
//   minute: 'numeric',
//   month: 'long',
//   day: 'numeric',
//   year: 'numeric',
//   weekday: 'long',
// }
// let date3 = new Intl.DateTimeFormat('en-US', objDate).format(new Date('10/10/2010'));
// let date4 = new Intl.DateTimeFormat('ar-SY', objDate).format(new Date());
// console.log(date3);
// console.log(date4);

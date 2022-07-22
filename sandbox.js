const bcrypt = require('bcryptjs')

let password = 'akukodok'
var salt = bcrypt.genSaltSync(5);
var hash = bcrypt.hashSync(password, salt);

// console.log(password)
// console.log(bcrypt.compareSync(password, hash)); // true
// password = 'akukuda'
// console.log(bcrypt.compareSync(password, hash)); // false

let angka ='absc'
console.log(parseInt(angka))

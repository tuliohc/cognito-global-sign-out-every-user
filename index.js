const aws = require('aws-sdk');
const interval = require('interval-promise')

aws.config.update({
    region: 'us-east-1',
});

const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});

let paramsListUsers = {
    UserPoolId: '',
    AttributesToGet: [
      'email'
    ]
};

let paramsGlobalSignOut = {
  UserPoolId: ''
};


let users = [];
let token;

exec_process();

function exec_process() {
  getUsers()
    .then(token => {
      if (token) {
        exec_process();
      }
      else {
        // Solve the TooManyRequestsException
        interval(async () => {
            while(users.length > 0){
              await signOut(users);
            }
        }, 3000, {iterations: users.length})
      }
    })
}

function getUsers() {
  return new Promise(function (resolve, reject) {
    cognitoidentityserviceprovider.listUsers(paramsListUsers, (err, data) => {
      if (err) {
        console.log(err, err.stack); 
        reject();
      }
      else {
        token = data['PaginationToken'];
          data['Users'].map(user => {
            users.push(user['Attributes'][0]['Value']);
          });
          paramsListUsers['PaginationToken'] = token;
        }
        resolve(token);
    });
  })
}

 
async function signOut(users) {
  if (users.length > 0) {
    paramsGlobalSignOut['Username'] = users[0];
    return new Promise(function (resolve, reject){
      cognitoidentityserviceprovider.adminUserGlobalSignOut(paramsGlobalSignOut, function(err, data) {
        if (err) {
          console.log(err, err.stack); 
          reject();
        }
        else {
          console.log(`User ${users[0]} will be signed out in the next one hour!`);
          users.shift();
          resolve();
        }    
      })
    })
  }
}





  



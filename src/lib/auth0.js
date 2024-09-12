const app = require('../index');
const auth0 = require('./auth0-token');
auth0.getAuthToken();

function Auth0Management() { }

const changePassword = async (data) => {
  try {
    console.debug('data: ' + JSON.stringify(data));
    await auth0.getAuthToken();
    app.management.getUsersByEmail(data.email, function (err, authUser) {
      if (err) {
        logger.debug(err);
      } else {
        if (authUser.length) {
          const authData = {
            password: data.password,
            connection: 'Username-Password-Authentication',
          };
          updateAuthOUser(authUser[0]['user_id'], authData);
        }
      }
    }).then(result => {
      console.debug(result);
    })
      .catch(err => {
        console.log(err);
      });
  } catch (error) {
    next(error);
  }
};
const createAuth0User = async (data) => {
  // console.debug('data: ' + JSON.stringify(data));
  try {
    await auth0.refreshToken();
    let authUserData = {}
   // authUserData['phone_number'] = ''; //data['phone'];
    authUserData['user_id'] = '';
    authUserData['connection'] = 'Username-Password-Authentication';
    authUserData['email'] = data['email'];
    authUserData['name'] = data['full_name'];
    authUserData['email_verified'] = false;
    authUserData['verify_email'] = false;
    authUserData['password'] = data['password']
      ? data['password']
      : 'Abcd@1234';
    authUserData['user_metadata'] = {
    }
    authUserData['app_metadata'] = {
       person_id:data['person_id'],
      // sfdcId: data['sfdcId'],
       accessType: 'talent',
      // userType: userType ? userType['slug'] : '',
      // AccountId: data['AccountId'],
      // userId: data['id'] ? userData['id'] : '',
      // firstname: data['firstname'],
      // lastname: data['lastname'],
      // status: data['status'],
         isActive: true,
    };
    app.management.createUser(authUserData, function (err, authUser) {
      if (err) {
        console.log('Created err',err);
      } else {
        console.log('Created authUser Done')
      }
    });
  } catch (error) {
    console.log('catch:: user not created at auth',error)
  }
};
async function updateAuthOUser(req) {
  await auth0.refreshToken();
  app.management.getUsersByEmail(req.email, function (err, authUser) {
    if (err) {
      logger.debug(err);
      cb(err, null);
    } else {
      
      if (authUser.length) {
        //need to update exiting Autho User
        const authData = {
          password: req.password,
          connection: 'Username-Password-Authentication',
        };
        app.management.updateUser({
          id: authUser[0]['user_id'],
        },
        authData,
        function (error, userUpdated) {
          if (error) {
            // handle error.
            console.debug(error);
            //cb(error, null);
          } else {
            console.log('userUpdated',userUpdated);
            //cb(null, userUpdated);
          }
        });
      }
    }
  });
}
module.exports = Auth0Management;
Auth0Management.updateAuthOUser = updateAuthOUser;
Auth0Management.createAuth0User = createAuth0User;
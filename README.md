# global-sign-out-every-user

Script to use cognito-idp admin-user-global-sign-out to every user of a pool.
You must define the `UserPoolId`.
This script assumes that you use email as a login.

This script project uses an approach to avoid the TooManyRequestsException, which is caused due to Soft Limits in Amazon Cognito User Pools APIs. For more info, check [here](https://docs.aws.amazon.com/cognito/latest/developerguide/limits.html). 
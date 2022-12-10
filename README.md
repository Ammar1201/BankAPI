# BankAPI

## users: (/api/users)

#### GET → API-Link/api/users → get all users

#### GET → API-Link/api/users/:userID → get single user

#### POST → API-Link/api/users → add new user

## accounts: (/api/users/:userID/accounts)

#### GET → API-Link/api/users/:userID/accounts → get all accounts for the user with the "userID"

#### POST → API-Link/api/users/:userID/accounts/new-account → add new account to user with the "userID"

#### PUT → API-Link/api/users/:userID/accounts/deposit → deposit money for the user with the "userID" .
    → in request body add { accountNumber, amountToDeposit }. accountNumber → the account to deposit to

#### PUT → API-Link/api/users/:userID/accounts/updateCredit → update credit for the user with the "userID".
    → in request body add { accountNumber, newCredit }. accountNumber → the account to update credit for

#### PUT → API-Link/api/users/:userID/accounts/withdraw → withdraw money from the user with the "userID".
    → in request body add { accountNumber, amountToWithdraw } . accountNumber → the account to withdraw from

## transfers: (/api/transfers)

#### GET → API-Link/api/transfers → get all the transfers happened

#### GET → API-Link/api/transfers/:transferID → get the a specific transfer

#### POST → API-Link/api/transfers/newTransfer → make a new transfer
    → in request body add { senderUserID, senderUserAccountNumber, receiverUserID, receiverUserAccountNumber, amountToTransfer }
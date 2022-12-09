export const randomAccountNumber = () => {
  return Math.floor(Math.random() * 999999 + 100000);
};

export const checkSenderUserAccountBalance = (account, amount) => {
  if (account.cash - amount < 0) {
    if (account.cash + account.credit - amount < 0) {
      return false;
    }

    account.cash -= amount;
    account.credit += account.cash;
    account.cash = 0;
    return true;
  }
  else {
    account.cash -= amount;
    return true;
  }
}

//* return true = bad request body, return false = good request body
export const checkReqBody = (reqBody) => {
  if (reqBody === undefined || (Object.values(reqBody).length === 0 && Object.keys(reqBody).length === 0)) {
    return { status: 'bad request', error: { errorStatus: 400, message: 'Bad Request No Request Body Provided!' } };
  }

  return { status: 'OK' };
};
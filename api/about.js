/* eslint-disable prefer-const */
/* eslint linebreak-style: ["error", "windows"] */

let aboutMessage = 'Issue Tracker API 1.0';

function setMessage(_, { message }) {
  aboutMessage = message;
  return aboutMessage;
}

function getMessage() {
  return aboutMessage;
}

module.exports = { getMessage, setMessage };

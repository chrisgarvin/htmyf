var $ = require ('jquery')

export function getMessage() {
  return $.getJSON('http://localhost:3000/message')
  .then(function(data) {
    return data.message;
  });
}

export function postMessage(message) {
  return $.post( "http://localhost:3000/submit", { text: message } );
}

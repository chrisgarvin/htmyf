var $ = require ('jquery')

export function getMessage() {
  return $.getJSON('http://localhost:3000/message')
  .then(function(data) {
    return data.message;
  });
}

export function postMessage(message, reaction, current) {
  return $.post( "http://localhost:3000/submit", {
      message: message,
      reaction: reaction,
      current: current
    } );
}

export function getStats() {
  return $.getJSON('http://localhost:3000/stats')
  .then(function(data) {
    var stats = { reactions: data.reactions,
                  current: data.current
                }
    return stats;
  });
}

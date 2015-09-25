$submitButton = $('#submitButton');

$submitButton.on('click', function() {
  console.log("SUBMIT!");
  
  var return_to = getQueryParam('return_to', 'pebblejs://close#');
  document.location = return_to + encodedURIComponent(JSON.stringify(getAndStoreConfigData()));
});

function getAndStoreConfigData() {
  var $username = $('#username');
  var $password = $('#password');
  
  var options = {
    username: $username.value(),
    password: $password.value()
  }
  
  localStorage.username = options.username;
  localStorage.password = options.password;
  
  console.log(JSON.stringify(options));
  return options;
}

function getQueryParam(variable, defaultValue) {
  var query = location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (pair[0] == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  
  return defaultValue || false;
}

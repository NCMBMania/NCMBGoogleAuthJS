function statusChangeCallback(response) {
  auth = response.authResponse;
  var expire_date = new Date(  auth.expires_in * 1000 + (new Date()).getTime()).toJSON();
  var date = {__type:"Date", iso:expire_date}; // Date型を保存できる形式に成型
  var authData = {id:auth.userId,
                  access_token:auth.access_token,
                  expiration_date:date};
  var user = new ncmb.User();
  user.signUpWith("google", authData) // ユーザの登録
    .then(function(user){
      return ncmb.User.loginWith(user); // SNS連携したユーザでログイン
    })
    .then(function(user){
      // ログイン後処理
      $("#status").html("ログイン中");
    })
    .catch(function(err){
      // エラー処理
    });
}

hello.init({
	google: 'YOUR_GOOGLE_CLIENT_ID'
}, {redirect_uri: 'redirect.html'});

$(function() {
  $(".login").on("click", function(e) {
    e.preventDefault();
    hello('google').login();
  });
  $(".logout").on("click", function(e) {
    e.preventDefault();
    hello('google').logout().then(function() {
      $("#status").html("ログインしていません");
    });
  });
  hello.on('auth.login', function(auth) {
    hello('google').api('me').then(function(json) {
      auth.authResponse.userId = json.id;
      statusChangeCallback(auth);
    }, function(e) {
	    alert('Whoops! ' + e.error.message);
    });
  });
});

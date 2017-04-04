// Initialize Firebase
var config = {
  apiKey: "AIzaSyDLltG-ib1d-nZg65HUs7udNoxDIn7rDB8",
  authDomain: "kokpit-f6ec6.firebaseapp.com",
  databaseURL: "https://kokpit-f6ec6.firebaseio.com",
  storageBucket: "kokpit-f6ec6.appspot.com",
  messagingSenderId: "48915756357"
};
firebase.initializeApp(config);

var tasksRef = firebase.database().ref('tasks/');
tasksRef.on('value', function(data) {
  data.forEach(function(childData) {
    console.log(childData.val().title);
  });
});



$(function() {
  var user = JSON.parse(localStorage.getItem("user_info"));
  if (user) {
    $('.auth-btn-github').after(user.name + 'としてログインしています！');
    $('.auth-btn-github').hide();

    $.ajax({
      url: "https://api.github.com/user/repos",
      type:'GET',
      dataType: 'json',
      data : {access_token : user.access_token},
      timeout:10000,
      success: function(data) {
        $.each(data, function() {
          console.dir(this);
          addRepo(this);
        });
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.warn(errorThrown);
      }
    });

  } else {
    $('.auth-btn-github').click(function() {
      OAuth.initialize('RiFT8OjQLXUWmCkGjdmQm-VyJLU');
      OAuth.popup("github", function(err, res) {
        var userInfo = new Object();
        userInfo.access_token = res.access_token;

        res.get('/user')
        .done(function(result) {
          userInfo.name = result.name;
          localStorage.setItem('user_info', JSON.stringify(userInfo));
        });

        res.get('/user/repos?access_token=' + res.access_token)
          .done(function(result) {
            $.each(result, function() {
              addRepo(result);
            });
          });
          res.get('/user/repos/issues?access_token=' + res.access_token)
            .done(function(result) {
              console.log(result);
              $.each(result, function() {

              });
            });
        });

      });
    }

  if (location.hash === '#callback') {
    location.hash = '';
    OAuth.callback('github')
      .done(function(res) {
        res.get('/user')
          .done(function(res) {
            var result = $('<div>')
              .append($('<div>').text('Hello, ' + res.login + '!'))
              .append($('<img>').attr('src', res.avatar_url));
            $('#success').html(result);
          })
          .fail(function(res) {
            window.alert('Failed to get usre info: see console for details');
            console.dir(err);
          })
      })
      .fail(function(err) {
        window.alert('Failed to authorization: see console for details');
        console.dir(err);
      });
  }
});

function addRepo(repo) {
  $('.repos').append('<a href="' + repo.html_url + '" target="_blank">' +
                       '<div class="col s12 m3">' +
                         '<div class="card">' +
                           '<div class="card-content">' +
                             '<span class="card-title">' + repo.name + '</span>' +
                             '<p>' + repo.description + '</p>' +
                           '</div>' +
                           '<div class="card-tabs">' +
                             '<ul class="tabs tabs-fixed-width">' +
                               '<li class="tab"><a href="#test4">Test 1</a></li>' +
                               '<li class="tab"><a class="active" href="#test5">Test 2</a></li>' +
                               '<li class="tab"><a href="#test6">Test 3</a></li>' +
                             '</ul>' +
                           '</div>' +
                           '<div class="card-content grey lighten-4">' +
                             '<div id="test4">Test 1</div>' +
                             '<div id="test5">Test 2</div>' +
                             '<div id="test6">Test 3</div>' +
                           '</div>' +
                         '</div>' +
                       '</div>' +
                     '</a>');
}

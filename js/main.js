// Initialize Firebase
var config = {
  apiKey: "AIzaSyDLltG-ib1d-nZg65HUs7udNoxDIn7rDB8",
  authDomain: "kokpit-f6ec6.firebaseapp.com",
  databaseURL: "https://kokpit-f6ec6.firebaseio.com",
  storageBucket: "kokpit-f6ec6.appspot.com",
  messagingSenderId: "48915756357"
};

firebase.initializeApp(config);

// Define Refs
var projectsRef = firebase.database().ref('projects/'); //プロジェクト
var goalsRef = firebase.database().ref('goals/'); //ゴール
var tasksRef = firebase.database().ref('tasks/'); //タスク
var cardsRef = firebase.database().ref('cards/'); //カード

// PROJECTS
projectsRef.on('value', function(data) {
  snapshot.forEach(function(snapshot) {
    var key = snapshot.key;
    var data = snapshot.val();
  });
});


// GOALS
// TASKS


//
//
// cardsRef.on('child_added', function(data) {
//   cardsHtml = "";
//   insertCards(data);
//   console.log(cardsHtml);
// });
// cardsRef.on('child_removed', function(data) {
//   cardsHtml = "";
//   insertCards(data);
//   $('.cards').html(cardsHtml);
// });
//
// //Card関連
// function createCard(title, size, link) {
//   if (!link) {
//     link = "";
//   }
//   cardsRef.push({
//     title: title,
//     size: size,
//     link: link
//   });
// }
//
// function removeCard(id){
//   cardsRef.child(id).remove();
// }
//
// function insertCards(data) {
//   var key = data.key;
//   var card = data.val();
//
//   cardsHtml = cardsHtml + '<a href="' + card.link + '" target="_blank">' +
//                              '<div class="DashCard col s12 m4 l3 draggable" data-card-id="' + key + '">' +
//                                '<div class="card" style="overflow: hidden;">' +
//                                  '<div class="card-image waves-effect waves-block waves-light">' +
//
//                                  '</div>' +
//                                  '<div class="card-content">' +
//                                    '<span class="card-title activator grey-text text-darken-4">' + card.title + '<i class="material-icons right">mode_edit</i></span>' +
//                                  '</div>' +
//
//                                  '<div class="card-action">' +
//                                    '<a href="#">Issues</a>' +
//                                    '<a href="#">プルリクエスト</a>' +
//                                  '</div>' +
//                                '</div>' +
//                              '</div>' +
//                            '</a>';
//
//   if (data.len) {
//
//   }
// }
//
// $(function() {
//   var user = JSON.parse(localStorage.getItem("user_info"));
//   if (user) {
//     $('.auth-btn-github').after(user.name + 'としてログインしています！');
//     $('.auth-btn-github').hide();
//
//     $.ajax({
//       url: "https://api.github.com/user/repos",
//       type:'GET',
//       dataType: 'json',
//       data : {access_token : user.access_token},
//       timeout:10000,
//       success: function(data) {
//         var dataIndex = 1;
//         $.each(data, function() {
//           var issues = new Array();
//           var that = this;
//           //issue取得
//           $.ajax({
//             url: this.issues_url.substr(0, this.issues_url.length-9),
//             type:'GET',
//             data : {access_token : user.access_token},
//             timeout:10000,
//             success: function(data) {
//               $.each(data, function() {
//                 issues.push(this.title);
//               });
//               addRepo(that, issues);
//             },
//             error: function(XMLHttpRequest, textStatus, errorThrown) {
//               console.warn(errorThrown);
//             }
//           });
//
//           console.log(dataIndex + ':' + data.length);
//
//           //最終処理
//           if (dataIndex == data.length) {
//             Sortable.create(repos, {
//               animation: 300, // ms, animation speed moving items when sorting, `0` — without animation
//               draggable: ".repo", // Specifies which items inside the element should be sortable
//             });
//           }
//
//           dataIndex++;
//         });
//       },
//       error: function(XMLHttpRequest, textStatus, errorThrown) {
//         console.warn(errorThrown);
//       }
//     });
//
//   } else {
//     $('.auth-btn-github').click(function() {
//       OAuth.initialize('RiFT8OjQLXUWmCkGjdmQm-VyJLU');
//       OAuth.popup("github", function(err, res) {
//         var userInfo = new Object();
//         userInfo.access_token = res.access_token;
//
//         res.get('/user')
//         .done(function(result) {
//           userInfo.name = result.name;
//           localStorage.setItem('user_info', JSON.stringify(userInfo));
//         });
//
//         res.get('/user/repos?access_token=' + res.access_token)
//           .done(function(result) {
//             $.each(result, function() {
//               addRepo(result);
//             });
//
//             var repos = document.getElementById("repos");
//           });
//           res.get('/user/repos/issues?access_token=' + res.access_token)
//             .done(function(result) {
//               console.log(result);
//               $.each(result, function() {
//
//               });
//             });
//         });
//
//       });
//     }
//
//   if (location.hash === '#callback') {
//     location.hash = '';
//     OAuth.callback('github')
//       .done(function(res) {
//         res.get('/user')
//           .done(function(res) {
//             var result = $('<div>')
//               .append($('<div>').text('Hello, ' + res.login + '!'))
//               .append($('<img>').attr('src', res.avatar_url));
//             $('#success').html(result);
//           })
//           .fail(function(res) {
//             window.alert('Failed to get usre info: see console for details');
//             console.dir(err);
//           })
//       })
//       .fail(function(err) {
//         window.alert('Failed to authorization: see console for details');
//         console.dir(err);
//       });
//   }
// });
//
// function addRepo(repo, issues) {
//   var issuesHtml = "";
//   for (var i = 0; i < issues.length; i++){
//     issuesHtml = issuesHtml + '<h5 class="issue">' + issues[i] + '</h5>';
//   }
//   console.log(issuesHtml);
//
//   $('.repos').append('<div class="repo col s12 m4 l3 draggable">' +
//                         '<div class="card" style="overflow: hidden;">' +
//                           '<div class="card-image waves-effect waves-block waves-light">' +
//
//                           '</div>' +
//                           '<div class="card-content">' +
//                             '<span class="card-title activator grey-text text-darken-4">' + repo.name + '<i class="material-icons right">mode_edit</i></span>' +
//                             '<p class="repo-desc">' + repo.description + '</p><br />' +
//                             '<p><a href="' + repo.html_url + '" target="_blank"><i class="icon ion-social-github left"></i>github.comで見る</a></p>' +
//                           '</div>' +
//
//                           '<div class="card-action">' +
//                             '<a href="#">Issues</a>' +
//                             '<a href="#">プルリクエスト</a>' +
//                           '</div>' +
//                         '</div>' +
//                       '</div>');
// }
//
// $(document).on('click', '.create-issue-btn', function() {
//   var issueUrl = $(this).data('issueUrl');
//   var issueTitle = $(this).parents('.issue-form').find('#issue_title').val();
//
//   createIssue(issueUrl, issueTitle);
// });
//
// function createIssue(url, title) {
//   var user = JSON.parse(localStorage.getItem("user_info"));
//
//   $.ajax({
//     url: url,
//     type:'POST',
//     data : {access_token : user.access_token, title: title},
//     timeout:10000,
//     success: function(data) {
//       console.log(data);
//     },
//     error: function(XMLHttpRequest, textStatus, errorThrown) {
//       console.warn(errorThrown);
//     }
//   });
// }

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

// PROJECTS ======================================================
projectsRef.on('value', function(data) {
  $('.projectList').html('');
  var n = data.numChildren();
  var c = 0;

  if (data.numChildren() == 0) {
    $('.projectList').append('<a href="#projectModal"><li class="collection-item"><i class="icon ion-plus"></i>&nbsp;プロジェクトを追加</li></a>');
    $('.projectScreen').hide();
  }

  data.forEach(function(snapshot) {
    var key = snapshot.key;
    var data = snapshot.val();

    insertProject(key, data);
    c++;

    if (n == c) {
      //挿入後の処理
      activateScreen(key);
      $('.projectList').append('<a href="#projectModal"><li class="collection-item"><i class="icon ion-plus"></i>&nbsp;プロジェクトを追加</li></a>');
    }
  });
});

function createProject(name, color) {
  if (!color) {
    color = "";
  }
  projectsRef.push({
    name: name,
    color: color
  });
}

function removeProject(key) {
  projectsRef.child(key).remove();
}

function activateScreen(key) {
  $('.projectScreen').hide();
  $('.collection-item').removeClass('active');

  $('[data-project-key="' + key + '"]').addClass('active');
  $('[data-project-id="' + key + '"]').show();
}

function insertProject(key, data) {
  $('.projectList').prepend('<li class="collection-item projectList-list" style="text-align: left" data-project-key="' + key + '"><span style="display: inline-block; margin-right: 8px; width: 10px; height: 10px; border-radius: 5px; background-color: ' + data.color + '"></span>' + data.name + '</li>');
  $('.project-screen').prepend('<div class="projectScreen" style="border-color: ' + data.color + '" data-project-id="' + key + '">' +
                                  '<div class="col l12"><h5>' + data.name + '</h5></div>' +
                                  '<span class="projectScreen_action">' +
                                    '<li class="projectScreen_action-editBtn"><i class="icon ion-edit"></i></li>' +
                                    '<li class="projectScreen_action-removeBtn"><i class="icon ion-trash-b"></i></li>' +
                                  '</span>' +
                                  '<ul class="goal-list"></ul>' +
                                '</div>');
}

//PROJECTS EVENT
$(document).ready(function(){
  $('.modal').modal();
  $('select').material_select();
});

$(document).on('click', '.projectList .projectList-list', function() {
  var projectId = $(this).data('projectKey');
  activateScreen(projectId);
});

$(document).on('click', '.modal-action', function() {
  var key = $(this).parents('.projectScreen').data('projectId');
  $('#goalProjectId').val(key);
});


$(document).on('click', '.projectScreen_action-removeBtn', function() {
  var key = $(this).parents('.projectScreen').data('projectId');
  removeProject(key);
});

$('.projectModalBtn').on('click', function() {
  var name = $('#projectName').val();
  var color = $('#projectColor').val();

  createProject(name, color);
  $('#projectName').val('');
  getAllGoals();
});


// GOALS ================================================================
goalsRef.on('value', function(data) {
  $('.goal-list').html('');
  $('.goal-box').remove();

  data.forEach(function(snapshot) {
    var key = snapshot.key;
    var data = snapshot.val();

    insertGoal(key, data);
  });

  $('.projectScreen').append('<div class="goal-box col l12"><a class="modal-action btn" href="#goalModal">ゴールを追加</a></div></div>');
});

function createGoal(title, projectId, description, priority) {
  goalsRef.push({
    title: title,
    project_id: projectId,
    description: description,
    priority: priority
  });
}

function insertGoal(key, data) {
  var project = $('[data-project-id="' + data.project_id + '"]');
  project.append('<div class="goal-box col l3 m3"><ul class="collection with-header" style="background: #fff">' +
                    '<li class="collection-header"><h5><i class="material-icons">flag</i>&nbsp;' + data.title + '<a href="#!" class="secondary-content"><i class="material-icons">timer</i></a></h5></li>' +
                    '<span class="tasks" id="tasks" data-goal-id="' + key + '"></span>' +
                    '<div class="col s12"><input id="taskName" style="margin: 0;" type="text" placeholder="タスク名を入力（Enterで追加）"></div>' +
                  '</ul></div>');

}

function getAllGoals() {
  goalsRef.once('value').then(function(snapshot) {
    $('.goal-list').html('');

    snapshot.forEach(function(snapshot) {
      var key = snapshot.key;
      var data = snapshot.val();

      insertGoal(key, data);
    });

    $('.projectScreen').append('<div class="goal-box col l12"><a class="modal-action btn" href="#goalModal">ゴールを追加</a></div></div>');
  });
}

//GOALS EVENT
$('.goalModalBtn').on('click', function() {
  var title = $('#goalTitle').val();
  var description = $('#goalDescription').val();
  var priority = $('#goalPriority').val();
  var projectId = $('#goalProjectId').val();

  createGoal(title, projectId, description, priority);
});


// TASKS =========================================================-
tasksRef.on('value', function(data) {
  $('.Task').remove();

  data.forEach(function(snapshot) {
    var key = snapshot.key;
    var data = snapshot.val();

    insertTask(key, data);
  });
});


function addTask(title, goalId, time) {
  tasksRef.push({
    title: title,
    goal_id: goalId,
    time: time,
    checked: false
  });
}

function checkTask(key) {
  tasksRef.child(key).update({
    checked: true
  });
}

function uncheckTask(key) {
  tasksRef.child(key).update({
    checked: false
  });
}

function removeTask(key) {
  tasksRef.child(key).remove();
}

function insertTask(key, data) {
  var goal = $('[data-goal-id="' + data.goal_id + '"]');

  if (data.checked) {
    var rightBtn = '<a class="secondary-content Task_action-removeBtn"><i class="material-icons" style="color: red">delete</i></a><a class="secondary-content Task_action-uncheckBtn"><i class="material-icons">redo</i></a>';
    var taskClass = 'checked';
  } else {
    var rightBtn = '<a class="secondary-content Task_action-checkBtn"><i class="material-icons">check</i></a><a class="secondary-content"><i class="material-icons">access_time</i></a>';
    var taskClass = 'unchecked';
  }
  goal.before('<li class="collection-item Task ' + taskClass + '" data-task-id="' + key + '"><p class="Task_title">' + data.title + '</p><span class="Task_action">' + rightBtn + '</span></li>');
  var tasks = document.getElementById("tasks");
  var sort = Sortable.create(tasks, {
    animation: 150, // ms, animation speed moving items when sorting, `0` — without animation
    draggable: ".task", // Specifies which items inside the element should be sortable
    onUpdate: function (evt/**Event*/){
       var item = evt.item; // the current dragged HTMLElement
    }
  });
}

//TASKS EVENT
$(document).on('click', '.Task_action-checkBtn', function() {
  var taskId = $(this).parents('.Task').data('taskId');
  checkTask(taskId);
});

$(document).on('click', '.Task_action-uncheckBtn', function() {
  var taskId = $(this).parents('.Task').data('taskId');
  uncheckTask(taskId);
});

$(document).on('click', '.Task_action-removeBtn', function() {
  var taskId = $(this).parents('.Task').data('taskId');
  removeTask(taskId);
});


// OTHERS =========================================================-


// Color Picker
$('#projectColor').val($('.colorPicker_item.active').data('cpColor'));

$('.colorPicker_item').on('click', function() {
  $('.colorPicker_item').removeClass('active');
  $(this).addClass('active');
  var selectedColor = $(this).data('cpColor');
  $('#projectColor').val(selectedColor);
});

// Enter Task Submit
$(document).on('keydown', '#taskName', function(e) {
  if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
    var title = $(this).val();
    var goalId = $(this).parents('.goal-box').find('.tasks').data('goalId');

    if (title != "") {
      addTask(title, goalId, '');
      $(this).val('');
    }
  }
});

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

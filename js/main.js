// Initialize Firebase
var config = {
  apiKey: "AIzaSyDLltG-ib1d-nZg65HUs7udNoxDIn7rDB8",
  authDomain: "kokpit-f6ec6.firebaseapp.com",
  databaseURL: "https://kokpit-f6ec6.firebaseio.com",
  storageBucket: "kokpit-f6ec6.appspot.com",
  messagingSenderId: "48915756357"
};
var provider = new firebase.auth.GithubAuthProvider();
provider.addScope('repo');

var currentUser = new Object();

firebase.initializeApp(config);

// USER =====================================
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    currentUser = user;
    $('.userName').text(currentUser.email);
    swal.close();
  } else {
    swal({
      title: 'ログインしてください',
      text: "Githubでログインできます。",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Githubでログイン',
      cancelButtonColor: '#bbb',
      cancelButtonText: 'キャンセル'
    }).then(function () {
      OAuth.initialize('RiFT8OjQLXUWmCkGjdmQm-VyJLU');
      OAuth.popup("github", function(err, res) {
        var token = res.access_token;
        console.log(token);
        var credential = firebase.auth.GithubAuthProvider.credential(token);
        firebase.auth().signInWithCredential(credential).catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          var email = error.email;
          var credential = error.credential;
          console.warn(errorMessage);
        });
      });
    })
  }
});
$(document).on('click', '.logoutBtn', function() {
  firebase.auth().signOut().then(function() {
    console.log('ログアウト完了');
  }, function(error) {
    console.log(error);
  });
});

// Define Refs
var projectsRef = firebase.database().ref('projects/'); //プロジェクト
var goalsRef = firebase.database().ref('goals/'); //ゴール
var tasksRef = firebase.database().ref('tasks/'); //タスク
var cardsRef = firebase.database().ref('cards/'); //カード
var memosRef = firebase.database().ref('memos/');

// PROJECTS ======================================================
projectsRef.on('value', function(data) {
  $('.projectList').html('');

  data.forEach(function(snapshot) {
    var key = snapshot.key;
    var data = snapshot.val();

    insertProject(key, data);
  });
  $('.projectList').append('<a href="#projectModal"><li class="collection-item"><i class="icon ion-plus"></i>&nbsp;プロジェクトを追加</li></a>');
  activateScreen();
});

function createProject(name, color) {
  if (!color) {
    color = "";
  }
  projectsRef.push({
    name: name,
    color: color,
    owner_email: currentUser.email
  });
}

function removeProject(key) {
  if(window.confirm('このプロジェクトを削除しますか？')){
    projectsRef.child(key).remove();
  }
}

function removeGoal(key) {
  if(window.confirm('ゴールを削除しますか？')){
    goalsRef.child(key).remove();
  }
}


function activateScreen(key) {
  $('.projectScreen').hide();
  $('.collection-item').removeClass('active');

  if (key) {
    $('[data-project-key="' + key + '"]').addClass('active');
    $('[data-project-id="' + key + '"]').show();
  } else {
    $('.dashboard-li').addClass('active');
    $('.DashBoard').show();
  }

}

function insertProject(key, data) {
  if (data.owner_email == currentUser.email) {
    $('.projectList').prepend('<li class="collection-item projectList-list" style="text-align: left" data-project-key="' + key + '"><span style="display: inline-block; margin-right: 8px; width: 10px; height: 10px; border-radius: 5px; background-color: ' + data.color + '"></span>' + data.name + '</li>');
    $('.main').prepend('<div class="projectScreen" style="border-color: ' + data.color + '" data-project-id="' + key + '">' +
                                    '<div class="col l12"><h5>' + data.name + '</h5></div>' +
                                    '<span class="projectScreen_action">' +
                                      '<li class="projectScreen_action-editBtn"><i class="icon ion-edit"></i></li>' +
                                      '<li class="projectScreen_action-deleteTaskBtn"><i class="icon ion-trash-b"></i></li>' +
                                      '<li class="projectScreen_action-removeBtn"><i class="icon ion-close"></i></li>' +
                                    '</span>' +
                                    '<ul class="goal-list"></ul>' +
                                  '</div>');
  }
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

$(document).on('click', '.projectScreen_action-deleteTaskBtn', function() {
  $('.Task.checked').each(function(index){
    var key = $(this).data('taskId');
    removeTask(key);
  });
});

$('.projectModalBtn').on('click', function() {
  var name = $('#projectName').val();
  var color = $('#projectColor').val();

  createProject(name, color);
  $('#projectName').val('');
  getAllGoals();
  getAllTasks();
});

// Dashborad
$('.dashboard-li').on('click', function () {
  activateScreen(null);
});

// GOALS ================================================================
goalsRef.on('value', function(data) {
  $('.goal-list').html('');
  $('.Goal').remove();
  var n = data.numChildren();
  var c = 0;

  if (n == 0) {
    var projectColor = $('[data-project-id="' + data.project_id + '"]').css('border-color');
    $('.projectScreen').append('<div class="Goal col l12"><a class="modal-action btn" style="background: ' + projectColor + '" href="#goalModal">ゴールを追加</a></div></div>');
  }

  data.forEach(function(snapshot) {
    var key = snapshot.key;
    var data = snapshot.val();

    insertGoal(key, data);
    insertGoal(key, data, 'dashboard');

    c++;

    if (n == c) {
      var projectColor = $('[data-project-id="' + data.project_id + '"]').css('border-color');
      $('.projectScreen').append('<div class="Goal col l12"><a class="modal-action btn" style="background: ' + projectColor + '" href="#goalModal">ゴールを追加</a></div></div>');
    }
  });
  updateScreen();
  getAllTasks();
});

function createGoal(title, projectId, description, priority) {
  goalsRef.push({
    title: title,
    project_id: projectId,
    description: description,
    priority: priority
  });
}

function insertGoal(key, data, target) {
  if (target == "dashboard") {
    var target = $('#DashBoard_col-1');
    var size = '';
  } else {
    var target = $('[data-project-id="' + data.project_id + '"]');
    var size = 'col m3';
  }
  target.append('<div class="Goal ' + size + '"><ul class="card collection with-header" style="background: #fff">' +
                    '<li class="collection-header"><span class=""></span><h5><i class="material-icons">flag</i>&nbsp;<span class="Goal_title">' + data.title + '</span><a class="secondary-content Goal_action-delete"><i class="material-icons" style="color: red">close</i></a><a class="secondary-content Goal_action-setTimer"><i class="material-icons">timer</i></a></h5><p>' + data.description + '</p></li>' +
                    '<span class="tasks" data-goal-id="' + key + '"></span>' +
                    '<div class="Goal_input"><input id="taskName" style="margin: 0;" type="text" placeholder="タスク名を入力（Enterで追加）"></div>' +
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

    $('.projectScreen').append('<div class="Goal col l12"><a class="modal-action btn" href="#goalModal">ゴールを追加</a></div></div>');
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

$(document).on('click', '.Goal_action-delete', function() {
  var key = $(this).parents('.Goal').find('.tasks').data('goalId');
  removeGoal(key);
});

$(document).on('click', '.Goal_action-setTimer', function() {
  alert();
});

// TASKS =========================================================-
tasksRef.orderByChild('index').on('value', function(data) {
  $('.Task').remove();

  data.forEach(function(snapshot) {
    var key = snapshot.key;
    var data = snapshot.val();

    insertTask(key, data);
  });

  getAllTasks();
  updateScreen();
});


function addTask(title, goalId, time, index) {
  tasksRef.push({
    title: title,
    goal_id: goalId,
    time: time,
    index: index,
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

function changeIndexTask(key, index) {
  tasksRef.child(key).update({
    index: index
  });
}

function setTimeTask(key, time) {
  tasksRef.child(key).update({
    time: time
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
    var rightBtn = '<a class="secondary-content Task_action-checkBtn"><i class="material-icons">check</i></a><a class="secondary-content Task_action-time dropdown-button" data-activates="time_dropdown">' + toMinutes(data.time) + '</a>';
    var taskClass = 'unchecked';
  }

  goal.append('<li id="task_' + data.index + '" class="collection-item Task ' + taskClass + '" data-task-id="' + key + '"><p class="Task_title">' + data.title + '</p><span class="Task_action">' + rightBtn + '</span></li>');
}

function getAllTasks() {
  tasksRef.orderByChild('index').once('value').then(function(snapshot) {
    $('.tasks').html('');

    snapshot.forEach(function(snapshot) {
      var key = snapshot.key;
      var data = snapshot.val();

      insertTask(key, data);
    });
  });
}

// Data about Task
var currentMoveY = 0;
var dragging = false;
var currentTask = "";

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

$(document).on('click', '.Task_action-time', function() {
  currentTaskId = $(this).parents('.Task').data('taskId');
});

$(document).on('click', '.change-time-btn', function() {
  var newTime = $(this).data('taskTime');
  var key = currentTaskId;
  setTimeTask(key, newTime)
});


function updateScreen() {
  $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: false, // Does not change width of dropdown to that of the activator
      gutter: 0, // Spacing from edge
      belowOrigin: false, // Displays dropdown below the button
      alignment: 'right', // Displays dropdown with edge aligned to the left of button
      stopPropagation: false // Stops event propagation
    }
  );

  $(".tasks").sortable({
    update: function( event, ui ) {
      var currentGoalId = ui.item.parents('.tasks').data('goalId');
      updateIndexTask(currentGoalId, true);
    }
  });

  $(".cards").sortable({
    update: function( event, ui ) {
      updateIndexCard();
    }
  });

  $(".memos").sortable({
    update: function( event, ui ) {
      updateIndexMemo();
    }
  });
}

function updateIndexTask(goalId, dashboard) {
  var goal = $('.Dashboard').find('[data-goal-id="' + goalId + '"]');
  goal.find('.Task').each(function(index) {
    var key = $(this).data('taskId');
    changeIndexTask(key, index);
  });
}

function updateIndexCard() {
  $('.cards .DashCard').each(function(index) {
    var key = $(this).data('cardId');
    changeIndexCard(key, index);
  });
}

function updateIndexMemo() {
  $('.memos .Memo').each(function(index) {
    var key = $(this).data('memoId');
    changeIndexMemo(key, index);
  });
}

// CARDS =========================================================-
function changeIndexCard(key, index) {
  cardsRef.child(key).update({
    index: index
  });
}

function changeIndexTask(key, index) {
  tasksRef.child(key).update({
    index: index
  });
}

function changeIndexMemo(key, index) {
  memosRef.child(key).update({
    index: index
  });
}

function createCard(title, type, index, size, htmlContent, bgColor, txColor, links, imageUrl) {
  //リンクがないやつは#入れる
  //
  cardsRef.push({
    title: title,
    type: type,
    index: index,
    size: size,
    html_content: htmlContent,
    bg_color: bgColor,
    text_color: txColor,
    links: links,
    image_url: imageUrl,
    owner_email: currentUser.email
  });
}

function insertCard(key, data) {
  $('.cards').append('<div data-card-id="' + key + '" class="DashCard col ' + data.size + '" data-link="' + data.links + '">' +
                        '<div class="card ' + data.bg_color + '" style="margin-top: 0px;">' +
                          '<div class="card-image">' +
                            '<img src="' + data.image_url + '">' +
                          '</div>' +
                          '<div class="card-content" style="color: ' + data.text_color + '">' +
                            '<span class="card-title">' + data.title + '</span>' +
                            '<p>' + data.html_content + '</p>' +
                          '</div>' +
                          '<div class="card-action">' +
                            '<a class="card-action-edit">編集</a>' +
                          '</div>' +
                        '</div>' +
                      '</div>');
}

cardsRef.orderByChild('index').on('value', function(data) {
  $('.DashCard').remove();

  data.forEach(function(snapshot) {
    var key = snapshot.key;
    var data = snapshot.val();

    insertCard(key, data);
  });
  updateScreen();
});


$(document).on('click', '.DashCard', function() {
  var links = $(this).data('link');
  if (links.match(/,/)) {
    ary = links.split(',');
    ary.forEach(function(val,index){
      window.open(val);
    });
  } else {
    window.open(links);
  }
});

$(document).on('click', '.DashCard .card-action', function() {
  return false;
});

$(document).on('click', '.DashCard .card-action-edit', function() {
  var cardId = $(this).parents('.DashCard').data('cardId');
  console.log(cardId);
});

$('.SlackMsg_input').on('keydown', function(e) {
  if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
    var msg = $(this).val();

    if (msg == "") {
      console.log('message cant be blank');
    } else {
      var url = 'https://slack.com/api/chat.postMessage';
      var data = {
          token: 'xoxp-37436581137-37433110709-170632250101-270fc8b06a338ccda2e07b5413b50340',
          channel: '#news',
          username: 'from_kokpit',
          text: msg
      };

      $.ajax({
          type: 'GET',
          url: url,
          data: data,
          success: function (data) {
            console.log('できました');
          }
      });
    }
  }
});

// MEMOS =========================================================-
memosRef.orderByChild('index').on('value', function(data) {
  $('.Memo').remove();

  data.forEach(function(snapshot) {
    var key = snapshot.key;
    var data = snapshot.val();

    insertMemo(key, data);
  });
  updateScreen();
});

function addMemo(title, content) {
  var index = $('.Memo').length + 1;
  console.log(index);
  memosRef.push({
    title: title,
    content: content,
    index: index,
    owner_email: currentUser.email
  });
}

function updateMemo(key, title, content) {
  memosRef.child(key).update({
    title: title,
    content: content
  });
}

function removeMemo(key) {
  memosRef.child(key).remove();
}

function insertMemo(key, data) {
  $('.memos').prepend('<div class="Memo card darken-1" data-memo-id="' + key + '">' +
                        '<div class="card-content">' +
                          '<div class="cardMask">' +
                            '<span class="cardMask_action">' +
                              '<i class="editMemo icon ion-edit"></i>' +
                              '<i class="deleteMemo icon ion-close"></i>' +
                            '</span>' +
                          '</div>' +
                          '<span class="card-title Memo_title">' + data.title + '</span>' +
                          '<p class="Memo_content">' + data.content + '</p>' +
                        '</div>' +
                      '</div>');
}

$(document).on('click', '#addMemoBtn', function() {
  openMemoModal('create');
});

$(document).on('click', '#memoFormBtn', function() {
  var title = $('#memoForm #memoTitle').val();
  var content = $('#memoForm #memoContent').val();
  var key = $('#memoForm #memoId').val();
  var type = $('#memoForm #formType').val();
  $('#memoModal').removeClass('open');
  switch (type) {
    case 'create':
      if (title == '') {
        alert('タイトルを入力してください');
      } else {
        addMemo(title, content);
      }
      break;
    case 'update':
      updateMemo(key, title, content);
      break;
    default:

  }
});

$(document).on('click', '.deleteMemo', function() {
  var key = $(this).parents('.Memo').data('memoId');
  removeMemo(key);
});

$(document).on('click', '.editMemo', function() {
  var memo = $(this).parents('.Memo');
  var key = memo.data('memoId');
  var prevTitle = memo.find('.Memo_title').text();
  var prevContent = memo.find('.Memo_content').text();
  openMemoModal('update', prevTitle, prevContent, key);
});

function openMemoModal(type, prevTitle, prevContent, key) {
  if (type == 'create') {
    $('#memoModal').addClass('open');
    $('#memoForm #memoTitle').val('');
    $('#memoForm #memoContent').val('');
    $('#memoForm #memoId').val('');
    $('#memoForm #formType').val(type);
  } else if (type == 'update') {
    $('#memoModal').addClass('open');
    $('#memoForm #memoTitle').val(prevTitle);
    $('#memoForm #memoContent').val(prevContent);
    $('#memoForm #memoId').val(key);
    $('#memoForm #formType').val(type);
  }
}

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
    var goal = $(this).parents('.Goal').find('.tasks');
    var index = goal.find('.Task').length;

    if (title != "") {
      addTask(title, goal.data('goalId'), 600, index + 1);
      $(this).val('');
    }
  }
});

$(document).on('mouseover', '.toggleMenuBtn', function () {
  if ($(window).width() < 1400) {
    $('.sidebar').removeClass('closed');
  }
});

$(document).on('mouseover', '.main', function () {
  if ($(window).width() < 1400) {
    $('.sidebar').addClass('closed');
  }
});

// toMinutes
function toMinutes(seconds){
  var rem = seconds % 60;
  if (seconds > 60) {
    var _minutes = (seconds - rem) / 60 ;
    if (rem == 0) {
      var _seconds = '00';
    } else {
      var _seconds = rem;
    }
  } else {
    var _minutes = '00';
    var _seconds = seconds
  }

  return _minutes + ":" + _seconds;
}

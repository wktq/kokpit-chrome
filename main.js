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
    $(".collapsible").append('<li>' +
      '<div class="collapsible-header"><i class="material-icons">filter_drama</i>' + childData.val().title + '</div>' +
      '</li>');
  });
});

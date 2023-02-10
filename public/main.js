let socket = io();
let color;
let id;
let userName;
let avatarColor;
const usernameRegex = /^[a-z0-9_.]/;
const validateUser = (userName) => {
  if (userName.match(usernameRegex)) {
    return true;
  }
};
$(".submitBtn").on("click", (e) => {
  e.preventDefault();

  let userName = $(".userName").val();

  if (userName) {
    if (validateUser(userName)) {
      // socket.emit("login", [$(".userName").val(), color, id]);
      // color = Math.floor(Math.random() * 16777215).toString(16);
      color = randomColor({
        luminosity: "dark",
        hue: "random",
      });
      avatarColor = randomColor({
        luminosity: "dark",
        hue: "random",
      });

      id = new Date().getTime();
      userName = $(".userName").val();
      $(".login__popup").removeClass("active");
    }
  }
  return false;
});

socket.on("getStatus", function (data) {
  $(".usersCount").html(data);
});

$("#form").submit(function () {
  if ($("#message__info").val()) {
    socket.emit("chat message", {
      msg: $("#message__info").val(),
      color: color,
      id: id,
      userName: $(".userName").val(),
      avatarColor: avatarColor,
    });

    $("#message__info").val("");
    return false;
  } else return false;
});
// let userName;
// let id;
// let color = "";
// socket.on("login", function (props) {
//   userName = props[0];
//   id = props[2];
//   color = props[1];
// });
socket.on("chat message", function (props) {
  console.log(props);
  $(".msgContainer").append(
    `<div class="msgBox" data-id="${props.id}">
    <div style="background-color:${
      props.avatarColor
    } " class="avatar">${props.userName[0].toUpperCase()}</div>
    <div style="background-color:${props.color} " class="msg">${props.msg}</div>
  </div>`
  );
});

$(".clearBtn").on("click", () => {
  $(".msgContainer").html("");
});

$(".msgContainer").on("DOMSubtreeModified", () => {
  $(".msgContainer").animate(
    { scrollTop: $(".msgContainer").prop("scrollHeight") },
    1000
  );
  let msges = document.querySelectorAll(".msg");

  msges.forEach((item) => {
    let msgBox = item.parentNode;
    let dataId = $(msgBox).attr("data-id");
    console.log(dataId);
    if (dataId.toString() === id.toString()) {
      $(msgBox).addClass("my-msg");
    }
  });
});

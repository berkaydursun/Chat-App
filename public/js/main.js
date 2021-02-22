const chatForm = document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


//Get username and room from URL

const {username,room}=Qs.parse(location.search,{
  ignoreQueryPrefix:true
});




const socket = io();

//Join Chat Room
socket.emit('joinRoom',{username,room});

// Get room and users
socket.on('roomUsers',({room,users})=>{

  outputRoomName(room);
  outputUsers(users);


});

//Message from server
socket.on('message', message => {

  outputMessage(message);

  //Scroll down
  chatMessages.scrollTop=chatMessages.scrollHeight;

});


//Message Submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  //Get message to user
  const msg = e.target.elements.msg.value;

  //Emit message to server
  socket.emit('chatMessage', msg);

  //Clear Input
  e.target.elements.msg.value='';
  e.target.elements.msg.focus();



});


//Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
  ${message.text}
  </p>
</div>`;
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room){

  roomName.innerHTML=room;

};

// Add users to DOM
function outputUsers(users){
  
  userList.innerHTML = `
  ${users.map(user =>`<li>${user.username}</li>`).join('')}`;

}
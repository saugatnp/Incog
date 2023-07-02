var roomId ;
    const socket = io({
      query: { 
        token: sessionStorage.getItem('token'),
        type: 'chat',
        interests: sessionStorage.getItem('interests')
      }
    });
    socket.emit('find-room', null);


    var messages = document.getElementById('messages');
    var form = document.getElementById('form');
    var input = document.getElementById('input');
    var loader = document.getElementById('loader-div');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (input.value) {
        // socket.to(roomId).emit('message', {'msg': input.value });
        socket.emit('message', { 'roomId': sessionStorage.getItem("room"), 'msg': input.value });
        var msg = document.createElement('li');
        msg.id = "message-list"
        msg.textContent = 'You : ' + input.value;
        messages.appendChild(msg);
        window.scrollTo(0, document.body.scrollHeight);
        input.value = '';
      }
    });


    socket.on('connected', function (m) {
      roomId = m.roomId;
      sessionStorage.setItem("room",  m.roomId  );

      if (m.roomId != null) {
        loader.hidden = true;
        input.disabled = false;
      }
      var roomId = document.getElementById('room');
      roomId.innerText = 'Room Id : ' + m.roomId;
      var elementToDelete = document.querySelectorAll('#message-list');
      elementToDelete.forEach(element => {

        element.remove();
      });
    }
    );

    socket.on('message', function (m) {
      var msg = document.createElement('li');
      msg.id = "message-list"
      msg.textContent = m.username + ' : ' + m.message;
      messages.appendChild(msg);
      window.scrollTo(0, document.body.scrollHeight);


    })
    socket.on('disconnect', function () {
   
      loader.hidden = false;
      input.disabled = true;
      socket.emit('find-room', null);
    })
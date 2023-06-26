var form = document.getElementById('form');
var user = document.getElementById('username');
var interests = document.getElementById('interests');




form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (user.value) {
        const socket = io({
            autoConnect: false,
            query: { 
                token: user.value,
                type: 'register',
                // interests: interests.value
            }

        });
        localStorage.setItem('token', user.value);
        localStorage.setItem('interests', interests.value);
        // socket.io.opts.query = { token: user.value };


        socket.connect();
        socket.on('redirect', (url) => {
            window.location.href = url;
        });


        user.value = '';
    }
});

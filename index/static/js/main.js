function checkMypage(){
    const loginLink = document.getElementById('login-link');
    const profilePanel = document.getElementById('profile-panel');
    const closeBtn = document.getElementById('close-profile');

    loginLink.addEventListener('click', function(event) {
        event.preventDefault();
        profilePanel.classList.toggle('open');
    });

    closeBtn.addEventListener('click', function() {
        profilePanel.classList.remove('open');
    });
};

document.addEventListener('DOMContentLoaded', checkMypage);
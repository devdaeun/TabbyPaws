//아이디 중복체크
function checkUserid() {
    const id = document.getElementById('id').value; //id값을 가져와서 비교하기
    if (id == ''){
        Swal.fire({
            icon: 'error',
            title: '입력값이 존재하지 않습니다!',
            text: '유효한 아이디를 입력해주세요.',
            });
            return;
    }else{
        fetch('/check-id', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                Swal.fire({
                    title: '중복',
                    text: '이미 사용 중인 아이디입니다.',
                    icon: 'error'
                });
            } else {
                Swal.fire({
                    title: '사용 가능',
                    text: '사용 가능한 아이디입니다.',
                    icon: 'success'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                title: '오류',
                text: '서버와의 통신에 문제가 발생했습니다.',
                icon: 'error'
            });
        });
    }
}

function checkUsername() {
    const name = document.getElementById('name').value; //id값을 가져와서 비교하기
    if (name == ''){
        Swal.fire({
            icon: 'error',
            title: '입력값이 존재하지 않습니다!',
            text: '유효한 닉네임을 입력해주세요.',
            });
            return;
    }else{
        fetch('/check-name', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name })
        })
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                Swal.fire({
                    title: '중복',
                    text: '이미 사용 중인 닉네임입니다.',
                    icon: 'error'
                });
            } else {
                Swal.fire({
                    title: '사용 가능',
                    text: '사용 가능한 닉네임입니다.',
                    icon: 'success'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                title: '오류',
                text: '서버와의 통신에 문제가 발생했습니다.',
                icon: 'error'
            });
        });
    }
}

function checkUseremail(){
    const email = document.getElementById('email').value; //id값을 가져와서 비교하기
    if (email == ''){
        Swal.fire({
            icon: 'error',
            title: '입력값이 존재하지 않습니다!',
            text: '유효한 이메일을 입력해주세요.',
            });
            return;
    }else{
        fetch('/check-email', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                Swal.fire({
                    title: '중복',
                    text: '이미 사용 중인 이메일입니다.',
                    icon: 'error'
                });
            } else {
                Swal.fire({
                    title: '사용 가능',
                    text: '사용 가능한 이메일입니다.',
                    icon: 'success'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                title: '오류',
                text: '서버와의 통신에 문제가 발생했습니다.',
                icon: 'error'
            });
        });
    }
}

//비밀번호 작성시 유효성 확인
document.addEventListener('DOMContentLoaded', function() {
    const passwordField = document.getElementById("password");
    const passwordCheckField = document.getElementById("pwd_check");
    const checkResult = document.getElementById("pwd_check_result");

    function passwordCheck() {
        const password = passwordField.value.trim();  // trim()으로 공백 제거
        const passwordCheck = passwordCheckField.value.trim();

        if (password === '' || passwordCheck === '') {
            checkResult.textContent = "비밀번호를 입력해주세요";
            checkResult.style.color = 'red';
        } else {
            if (password === passwordCheck) {
                checkResult.textContent = "비밀번호가 일치합니다.";
                checkResult.style.color = 'green';
            } else {
                checkResult.textContent = "비밀번호가 일치하지 않습니다.";
                checkResult.style.color = 'red';
            }
        }
    }

    passwordField.addEventListener('input', passwordCheck);
    passwordCheckField.addEventListener('input', passwordCheck);
});

//세션여부 확인
document.addEventListener('DOMContentLoaded', function() {
    const isAuthenticated = JSON.stringify(isAuthenticated);

    if (isAuthenticated) {
        const loginLink = document.getElementById('login-link');
        const profilePanel = document.getElementById('profile-panel');
        const closeBtn = document.getElementById('close-profile');

        loginLink.addEventListener('click', function(event) {
            event.preventDefault(); // 링크 기본 동작 방지
            profilePanel.classList.toggle('open');
        });

        closeBtn.addEventListener('click', function() {
            profilePanel.classList.remove('open');
        });
    }
});
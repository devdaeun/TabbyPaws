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


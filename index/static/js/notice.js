function updateNotice(noticeId) {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    $.ajax({
        url: '/notice/update/' + noticeId,
        method: 'POST',
        data: {
            title: title,
            content: content
        },
        success: function(response) {
            alert('수정되었습니다.');
            window.location.href = '/notice/' + noticeId; // 수정 후 상세보기 페이지로 리다이렉션
        },
        error: function(error) {
            alert('수정 실패.');
        }
    });
}

function cancelEdit() {
    window.location.href = '/notice'; // 취소 시 공지 목록으로 이동
}

function enableEdit() {
    document.getElementById('title').removeAttribute('readonly');
    document.getElementById('content').removeAttribute('readonly');
}

function deleteNotice(noticeId) {
    if (confirm('정말 삭제하시겠습니까?')) {
        $.ajax({
            url: '/notice/delete/' + noticeId,
            method: 'POST',
            success: function(response) {
                alert('삭제되었습니다.');
                window.location.href = '/notice'; // 삭제 후 목록 페이지로 리다이렉션
            },
            error: function(error) {
                alert('삭제 실패.');
            }
        });
    }
}

function backToList() {
    window.location.href = '/notice'; // 리스트로 돌아가기
}
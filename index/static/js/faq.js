$(function(){
    $(".toggle_btn").click(function() {
        $(this).closest(".faqitem").find(".answer").slideToggle();

        // 이미지도 토글
        var img = $(this);
        if (img.attr('src') === '../../images/angle_down.svg') {
            img.attr('src', '../../images/angle_up.svg');
        } else {
            img.attr('src', '../../images/angle_down.svg');
        }
        
    });
});

$(function() {
    $(".modify_button").click(function() {
        // 클릭된 버튼의 부모 요소를 선택합니다.
        let mparent = $(this).parent();

        // 부모 요소의 이전 형제 요소의 스타일을 변경합니다.
        mparent.prev().css("display", "block");

        // 부모 요소의 스타일을 변경합니다.
        mparent.css("display", "none");

        // 총 부모 요소()를 선택합니다.
        let tparent = mparent.parent();

        tparent.find(".faq_title").prop('disabled', false);
        tparent.find(".faq_content").prop('disabled', false);
    });
});

$(function() {
    $(".return_button").click(function() {
        // 클릭된 버튼의 부모 요소를 선택합니다.
        let mparent = $(this).parent();

        // 부모 요소의 이전 형제 요소의 스타일을 변경합니다.
        mparent.prev().css("display", "none");

        // 부모 요소의 스타일을 변경합니다.
        mparent.css("display", "block");

        // 총 부모 요소()를 선택합니다.
        let tparent = mparent.parent();

        tparent.find(".faq_title").prop('disabled', true);
        tparent.find(".faq_content").prop('disabled', true);
    });
});

function updateFaq(faqlist) {
    // 폼 요소에서 데이터를 추출합니다.
    const formData = new FormData(faqlist);

    // FormData를 객체로 변환합니다.
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    const id = data.faq_id;
    const title = data.title;
    const content = data.content;

    $.ajax({
        url: '/faq/update/' + id,
        method: 'POST',
        data: {
            title: title,
            content: content
        },
        success: function(response) {
            alert('수정되었습니다.');
            window.location.href = '/faq'; // 수정 후 상세보기 페이지로 리다이렉션
        },
        error: function(error) {
            alert('수정 실패.');
        }
    });
}

function deleteFaq(faqId) {
    if (confirm('정말 삭제하시겠습니까?')) {
        $.ajax({
            url: '/faq/delete/' + faqId,
            method: 'POST',
            success: function(response) {
                alert('삭제되었습니다.');
                window.location.href = '/faq'; // 삭제 후 목록 페이지로 리다이렉션
            },
            error: function(error) {
                alert('삭제 실패.');
            }
        });
    }
}
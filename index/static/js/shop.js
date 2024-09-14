$(function(){
    $(".link_btn").click(function() {
        $(this).closest(".link_container").find(".link_text").slideToggle();     
    });
});

document.addEventListener('DOMContentLoaded', () =>{
    const checkboxs = document.querySelectorAll('.aliergic_container input[type="checkbox"]');
    const valueInput = document.querySelector('#allergies');

    function updateValue() {
        const checkedValues = []; //빈 리스트 생성 여기다가 값 넣을거야

        checkboxs.forEach(checkbox => {
            if(checkbox.checked){
                checkedValues.push(checkbox.name);
            }
        });

        valueInput.value = checkedValues.join(',');
    }

    checkboxs.forEach(checkbox => {
        checkbox.addEventListener('change', updateValue);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // 모든 .shop-item 요소를 선택합니다
    document.querySelectorAll('.shop-item').forEach(item => {
      // data-allergies 속성에서 알레르기 정보를 가져옵니다
      const allergies = item.getAttribute('data-allergies');
      const allergiesArray = allergies ? allergies.split(',') : [];
      
      // 아이콘을 추가할 .allergies-icons 요소를 선택합니다
      const iconsContainer = item.querySelector('.allergies-icons');

      // 각 알레르기에 대해 아이콘을 추가합니다
      allergiesArray.forEach(allergy => {
        let iconSrc;

        // 아이콘 소스를 결정합니다
        switch (allergy.trim()) {
          case 'chicken':
            iconSrc = '../../images/chicken.svg';
            break;
          case 'beef':
            iconSrc = '../../images/beef.svg';
            break;
          case 'pork':
            iconSrc = '../../images/pork.svg';
            break;
          case 'nuts':
            iconSrc = '../../images/nuts.svg';
            break;
        }

        // 아이콘 이미지를 생성하고 .allergies-icons에 추가합니다
        const img = document.createElement('img');
        img.src = iconSrc;
        img.alt = `${allergy} Allergy`;
        iconsContainer.appendChild(img);
      });
    });
  });

function deleteGoods(shop_id){
  if (confirm('정말 삭제하시겠습니까?')) {
    $.ajax({
        url: '/shop/delete/' + shop_id,
        method: 'POST',
        success: function(response) {
            alert('삭제되었습니다.');
            window.location.href = '/shop'; // 삭제 후 목록 페이지로 리다이렉션
        },
        error: function(error) {
            alert('삭제 실패.');
        }
    });
}
}

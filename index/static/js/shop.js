$(function() {
  // 알레르기 체크박스와 입력 필드
  const checkboxInputs = document.querySelectorAll('.aliergic_container input[type="checkbox"]');
  const valueInput = document.querySelector('#allergies');

  function updateValue() {
      const checkedValues = [];

      checkboxInputs.forEach(checkbox => {
          if (checkbox.checked) {
              checkedValues.push(checkbox.value); // value 속성을 사용
          }
      });

      valueInput.value = checkedValues.join(',');
  }

  checkboxInputs.forEach(checkbox => {
      checkbox.addEventListener('change', updateValue);
  });


  // 쇼핑 아이템에 알레르기 아이콘 추가
  document.querySelectorAll('.shop-item').forEach(item => {
      const allergies = item.getAttribute('data-allergies');
      const allergiesArray = allergies ? allergies.split(',') : [];
      const iconsContainer = item.querySelector('.allergies-icons');

      allergiesArray.forEach(allergy => {
          const trimmedAllergy = allergy.trim();
          const iconSrc = getIconSrc(trimmedAllergy);

          if (iconSrc) {
              const img = document.createElement('img');
              img.src = iconSrc;
              img.alt = `${trimmedAllergy} Allergy`;
              iconsContainer.appendChild(img);
          }
      });
  });

  function getIconSrc(allergy) {
      const allergyIcons = {
          chicken: '../../images/chicken.svg',
          beef: '../../images/beef.svg',
          pork: '../../images/pork.svg',
          nuts: '../../images/nuts.svg'
      };
      return allergyIcons[allergy] || null;
  }

  // 삭제 기능
  window.deleteGoods = function(shop_id) {
      if (confirm('정말 삭제하시겠습니까?')) {
          $.ajax({
              url: '/shop/delete/' + shop_id,
              method: 'POST',
              success: function(response) {
                  alert('삭제되었습니다.');
                  window.location.href = '/shop'; // 삭제 후 목록 페이지로 리다이렉션
              },
              error: function(error) {
                  console.error('삭제 오류:', error);
                  alert('삭제 실패. 오류가 발생했습니다.');
              }
          });
      }
  };

  // 토글 버튼 기능
  $('.toggle_btn').click(function() {
      const targetId = $(this).data('target');
      $(targetId).slideToggle(); // 해당 ID의 내용을 펼치거나 숨깁니다.
  });

    $(document).ready(function() {
        $('.link_btn').change(function() {
            $('.link_text').slideToggle(this.checked);
        });
    });

    $(document).ready(function() {
        $('.link_btn').change(function() {
            if (this.checked && $('.link_text').val().trim() !== '') {
                $('textarea[name="ingredient"]').prop('required', false);
            } else {
                $('textarea[name="ingredient"]').prop('required', true);
            }
        });

        $('.link_text').on('input', function() {
            if ($('.link_btn').is(':checked') && $(this).val().trim() !== '') {
                $('textarea[name="ingredient"]').prop('required', false);
            } else {
                $('textarea[name="ingredient"]').prop('required', true);
            }
        });
    });
});

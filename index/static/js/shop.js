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

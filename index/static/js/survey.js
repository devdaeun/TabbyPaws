function foodResult(){
    const age = document.querySelector('select[name="age"]').value || null;
    const texture = document.querySelector('select[name="texture"]').value || null;
    const allergies = document.querySelector('select[name="allergies"]').value || null;
    const special = document.querySelector('select[name="special"]').value || null;

    

    fetch('/survey/result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ age: age , texture: texture, allergies: allergies, special:special})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const resultContainer = document.getElementById('survey_result');
        resultContainer.innerHTML = ''; // 기존 내용을 지우기

        data.recommendations.forEach(item => {
            const p = document.createElement('p'); // <p> 태그 생성
            p.innerText = item; // 결과 텍스트 추가
            resultContainer.appendChild(p); // 결과 컨테이너에 추가
        });
    })
}
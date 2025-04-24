let input = document.getElementById('input')
let submit = document.getElementById('submit')

submit.addEventListener('click', function() {
    console.log(input.value)
    fetch('/.netlify/functions/getData')
    .then(res => res.json())
    .then(data => console.log(data));
})
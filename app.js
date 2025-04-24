let input = document.getElementById('input')
let submit = document.getElementById('submit')
var data = process.env.API_KEY;

submit.addEventListener('click', function() {
    console.log(input.value)
    console.log(data)
})
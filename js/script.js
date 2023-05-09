
function changeVal() {
    document.querySelector('#rangeValue').innerHTML = document.getElementsByName('temper')[0].value
}

for (let i = 23; i <= 38; i++) {
    document.getElementsByName('age')[0].innerHTML += `
        <option value="${i}">${i}</option>
    `
}

(() => {
    'use strict'
  
    const forms = document.querySelectorAll('.needs-validation')

    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
  })()
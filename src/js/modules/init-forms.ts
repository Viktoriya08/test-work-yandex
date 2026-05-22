import JustValidate from 'just-validate'
import { addRules } from '../helpers/form-helpers'

const validateOptions = {
  lockForm: true,
  errorLabelStyle: '',
  errorFieldCssClass: 'has-error',
  errorLabelCssClass: 'input-error',
  validateBeforeSubmitting: false,
  focusInvalidField: false
}
const submitForm = (e: Event) => {
  const targetForm = e.target as HTMLFormElement
  const name = targetForm.getAttribute('data-form') || ''
  const action = targetForm.getAttribute('action') || `${window.location}`
  const dataForm = new FormData(targetForm)
  const submitBtn = targetForm.querySelector('[type="submit"]')

  submitBtn?.classList.add('is-load')

  fetch(action, {
    method: 'POST',
    credentials: 'same-origin',
    body: dataForm
  })
  .then((res) => {
    if (!res.ok) {
      submitBtn?.classList.remove('is-load')
      throw new Error('Server error')
    }
    return res.json()
  })
  .then((data) => {
    if (!data) {
      throw new Error('Invalid JSON response')
    } else {
      console.log('SENDED')
    }

    submitBtn && submitBtn.classList.remove('is-load')
  })
  .catch((err) => {
    submitBtn?.classList.remove('is-load')
    console.error(err)
  })
}

const initForms = () => {
  const forms: NodeListOf<HTMLFormElement> = document.querySelectorAll('[data-form]:not(.is-init)')

  forms.forEach((form) => {

    const validate = new JustValidate(form, validateOptions)

    addRules(form, validate)
    validate.onSuccess((e) => submitForm(e as Event))
    form.API = validate
    form.classList.add('is-init')
  })
}

////////////////////////////////

function clearInput (trigger: HTMLElement) {
  const inputBox: Element | null = trigger.parentElement
  const input = inputBox?.querySelector('input') as HTMLInputElement
  if (!input) {
    return
  }
  input.value = ''
}

function addResponseText (form: HTMLElement) {
  const responseContainer = form.querySelector('[data-response]');
  const paragraph = document.createElement('p');
  paragraph.textContent = 'Мы получили вашу заявку и в ближайшее время свяжемся с вами';
  responseContainer?.appendChild(paragraph);
  form.classList.add('is-submitted')
}

function initFormsNew(): void {
  const inputClearBtns: NodeListOf<HTMLElement> = document.querySelectorAll('.base-input__clear')

  inputClearBtns.forEach((btn: HTMLElement) =>{
    btn.addEventListener('click', () => {
      clearInput(btn)
    })
  })

  const forms: NodeListOf<HTMLFormElement> = document.querySelectorAll('[data-form]:not(.is-init)')

  forms.forEach((form) => {

    form.addEventListener('submit', function(event) {

      event.preventDefault()


      const elements = form.querySelectorAll('input') as NodeListOf<HTMLInputElement>

      elements.forEach(input => {
          input?.parentElement?.classList.remove('is-error');

          input.addEventListener('input', function() {

            if (input.value.trim()) {
              input?.parentElement?.classList.remove('is-error')
            }
        });
      });


      let isValid = true;

      elements.forEach((input) => {
        const inputValue = input.value.trim();
        if (input.type === 'checkbox') {
          if (!input.checked) {
            input?.parentElement?.classList.add('is-error')
            isValid = false;

            // Добавляем обработчик события change для удаления класса is-error
            input.addEventListener('change', function() {
                if (input.checked) {
                    input?.parentElement?.classList.remove('is-error')
                }
            });
          }
        } else {
          if (inputValue === '') {
            isValid = false
            input?.parentElement?.classList.add('is-error')

          } else {
            isValid = true
          }

        }
      })

      if(isValid) {
        addResponseText(form)
      }

    })
  })
}

export { validateOptions, initForms, initFormsNew }

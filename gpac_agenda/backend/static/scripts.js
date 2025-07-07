import { supabase } from './supabaseclient.js'

document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault()

  const email = document.getElementById('email').value
  const senha = document.getElementById('password').value

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: senha
  })

  if (error) {
    alert('Erro ao fazer login: ' + error.message)
  } else {
    alert('Login feito com sucesso!')
    
    window.location.href = 'daily-agenda.html'
  }
})

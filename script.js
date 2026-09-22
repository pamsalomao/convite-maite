const ENDPOINT = 'https://script.google.com/macros/s/AKfycbw1TtLEVtRaqm6StZlIeftZJWWc3Hw9AjOkKE4ghDYBe1_8AfzW_eUxHMcCxRgHeX1i/exec';
const screens = [...document.querySelectorAll('.screen')];
const video = document.getElementById('inviteVideo');
const toast = document.getElementById('toast');

function show(id) {
  screens.forEach(s => s.classList.toggle('active', s.id === id));
  window.scrollTo({top:0, behavior:'instant'});
}

async function startInvite() {
  show('videoScreen');
  try { video.currentTime = 0; await video.play(); }
  catch (_) { video.controls = true; }
}
function finishVideo(){ video.pause(); show('mainInvite'); }

document.getElementById('openInvite').addEventListener('click', startInvite);
document.getElementById('skipVideo').addEventListener('click', finishVideo);
video.addEventListener('ended', finishVideo);
document.getElementById('openRsvp').addEventListener('click', () => show('rsvp'));
document.getElementById('openGifts').addEventListener('click', () => show('gifts'));
document.querySelectorAll('[data-back]').forEach(b => b.addEventListener('click', () => show('mainInvite')));

function message(text, ok=true) {
  toast.textContent = text;
  toast.style.background = ok ? 'rgba(83,34,77,.95)' : 'rgba(150,45,75,.96)';
  toast.classList.add('show');
  clearTimeout(message.t);
  message.t = setTimeout(() => toast.classList.remove('show'), 4200);
}

document.getElementById('rsvpForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('guestName').value.trim();
  const acompanhantes = document.getElementById('companions').value.trim();
  if (!nome) { message('Digite seu nome para confirmar 💗', false); return; }
  const btn = document.getElementById('submitRsvp');
  btn.disabled = true;
  try {
    const res = await fetch(ENDPOINT, {
      method:'POST',
      headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify({nome, acompanhantes})
    });
    const data = await res.json();
    if (!data.sucesso) throw new Error(data.mensagem || 'Erro ao confirmar');
    message(data.mensagem || 'Presença confirmada! 💕');
    e.target.reset();
  } catch (err) {
    message('Não consegui confirmar agora. Tente novamente em instantes. 💗', false);
  } finally { btn.disabled = false; }
});

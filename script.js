// Floating Hearts

const container = document.querySelector('.floating-hearts');

for(let i=0;i<40;i++) {

  const heart = document.createElement('div');

  heart.innerHTML = '♡';

  heart.style.position = 'fixed';
  heart.style.left = Math.random()*100 + 'vw';
  heart.style.top = Math.random()*100 + 'vh';
  heart.style.fontSize = (Math.random()*20+10)+'px';
  heart.style.color = '#ff9dbd';
  heart.style.opacity = '.5';
  heart.style.pointerEvents = 'none';

  container.appendChild(heart);

  gsap.to(heart, {
    y: -200,
    duration: Math.random()*10+10,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut
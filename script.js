const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------------------------
     PASSWORD = 1234
  ----------------------------------------- */
  const PASSWORD = "2024";
  const intro = $("#intro");
  const app = $("#app");
  const pass = $("#password");
  const wrong = $("#wrong");

  // little stars
  const stars = $("#introStars");
  for(let i=0;i<85;i++){
    const s = document.createElement("span");
    s.className = "intro-star";
    s.style.left = Math.random()*100 + "%";
    s.style.top = Math.random()*100 + "%";
    const size = Math.random()*2.8+.6;
    s.style.width = s.style.height = size + "px";
    s.style.setProperty("--duration", `${1.2 + Math.random()*3}s`);
    s.style.animationDelay = `${Math.random()*3}s`;
    stars.appendChild(s);
  }

  function openSite(){
    intro.classList.add("exit");
    setTimeout(() => {
      intro.classList.add("hidden");
      app.classList.remove("hidden");
      window.scrollTo(0,0);
      showWelcome();
    }, 900);
  }

  function checkPassword(){
    if(pass.value === PASSWORD){
      openSite();
      sparkleBurst(innerWidth/2, innerHeight/2, 45);
    }else{
      wrong.classList.add("show");
      intro.querySelector(".intro-center").classList.remove("shake");
      void intro.offsetWidth;
      intro.querySelector(".intro-center").classList.add("shake");
      pass.select();
      setTimeout(()=>wrong.classList.remove("show"),2200);
    }
  }

  $("#enterBtn").addEventListener("click", checkPassword);
  pass.addEventListener("keydown", e => {
    if(e.key === "Enter") checkPassword();
  });

  /* -----------------------------------------
     Reveal animations without external library
  ----------------------------------------- */
  const revealSelectors = [
    ".section-label",".letter-layout",".gallery-head",".cutout",
    ".why-layout",".story-title",".story-card",".gift-copy",".gift-card",
    ".final-gif",".final-small",".ending h2",".final-date",".forever",
    ".game-kicker",".quest-heading",".button-head",".magic-button"
  ];

  revealSelectors.forEach(selector => {
    $$(selector).forEach((el,index) => {
      el.classList.add("motion-up");
      el.style.transitionDelay = `${Math.min(index * 45, 280)}ms`;
    });
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.08, rootMargin:"0px 0px -45px 0px"});

  $$(".motion-up").forEach(el => io.observe(el));

  /* -----------------------------------------
     Scroll progress
  ----------------------------------------- */
  const scrollPercent = $("#scrollPercent");
  function updateScroll(){
    const max = document.documentElement.scrollHeight - innerHeight;
    const pct = max > 0 ? Math.round((scrollY / max) * 100) : 0;
    scrollPercent.textContent = String(pct).padStart(2,"0") + "%";
  }
  addEventListener("scroll", updateScroll, {passive:true});
  updateScroll();

  /* -----------------------------------------
     Subtle cursor sparkles on desktop
  ----------------------------------------- */
  let lastSpark = 0;
  addEventListener("pointermove", e => {
    if(innerWidth < 800) return;
    const now = performance.now();
    if(now - lastSpark < 95) return;
    lastSpark = now;

    const spark = document.createElement("span");
    spark.className = "cursor-spark";
    spark.textContent = Math.random() > .35 ? "·" : "✦";
    spark.style.left = e.clientX + "px";
    spark.style.top = e.clientY + "px";
    document.body.appendChild(spark);
    setTimeout(()=>spark.remove(),850);
  }, {passive:true});

  /* -----------------------------------------
     Gentle hero parallax
  ----------------------------------------- */
  const cover = $(".cover");
  const artFrame = $(".art-frame");
  if(cover && artFrame && innerWidth > 800){
    cover.addEventListener("pointermove", e => {
      const rect = cover.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - .5;
      const y = (e.clientY - rect.top) / rect.height - .5;
      artFrame.style.transform = `rotate(${4 + x*3}deg) translate(${x*10}px,${y*10}px)`;
    });
    cover.addEventListener("pointerleave",()=>{
      artFrame.style.transform = "rotate(4deg) translate(0,0)";
    });
  }

  /* -----------------------------------------
     Gallery lightbox
  ----------------------------------------- */
  const lightbox = $("#lightbox");
  const lbImg = $("#lightboxImage");
  const lbCaption = $("#lightboxCaption");

  $$(".cutout").forEach(card => {
    card.addEventListener("click", () => {
      lbImg.src = $("img", card).src;
      lbImg.alt = $("img", card).alt;
      lbCaption.textContent = $("figcaption", card).textContent;
      lightbox.classList.add("open");
      document.body.classList.add("locked");
    });
  });

  function closeLightbox(){
    lightbox.classList.remove("open");
    document.body.classList.remove("locked");
  }
  $("#closeLightbox").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", e => {
    if(e.target === lightbox) closeLightbox();
  });

  /* -----------------------------------------
     Why-you doors
  ----------------------------------------- */
  const modal = $("#messageModal");
  const message = $("#messageText");

  $$(".door").forEach(door => {
    door.addEventListener("click", () => {
      message.textContent = door.dataset.message;
      modal.classList.add("open");
      document.body.classList.add("locked");
      sparkleBurst(innerWidth/2, innerHeight/2, 18);
    });
  });

  function closeModal(){
    modal.classList.remove("open");
    document.body.classList.remove("locked");
  }
  $("#closeModal").addEventListener("click", closeModal);
  $("#modalOkay").addEventListener("click", closeModal);
  modal.addEventListener("click", e => {
    if(e.target === modal) closeModal();
  });

  /* -----------------------------------------
     Sound button — optional local song
     Put music.mp3 beside index.html.
  ----------------------------------------- */
  const soundBtn = $("#soundBtn");
  const audio = new Audio("music.mp3");
  audio.loop = true;
  audio.preload = "auto";
  let musicAvailable = true;

  audio.addEventListener("error", ()=>{
    musicAvailable = false;
    soundBtn.textContent = "add music ♫";
  });

  async function startMusic(){
    if(!musicAvailable) return false;
    try{
      await audio.play();
      soundBtn.textContent = "music on ♫";
      return true;
    }catch{
      return false;
    }
  }

  soundBtn.addEventListener("click", async ()=>{
    if(!musicAvailable){
      soundBtn.textContent = "music.mp3";
      setTimeout(()=>soundBtn.textContent="music ♫",1800);
      return;
    }
    if(audio.paused){
      await startMusic();
    }else{
      audio.pause();
      soundBtn.textContent = "music ♫";
    }
  });

  /* -----------------------------------------
     Forever button
  ----------------------------------------- */
  $("#forever").addEventListener("click", e => {
    sparkleBurst(e.clientX,e.clientY,100);
    const b = $("#forever");
    b.innerHTML = "<span>wish sent</span><b>♡</b>";
    setTimeout(()=>{
      b.innerHTML = "<span>make a wish</span><b>✦</b>";
    },2500);
  });

  /* -----------------------------------------
     Floating sparkle / hearts
  ----------------------------------------- */
  function sparkleBurst(x,y,count){
    const symbols=["✦","♡","♥","·","✧"];
    for(let i=0;i<count;i++){
      const el=document.createElement("span");
      el.textContent=symbols[Math.floor(Math.random()*symbols.length)];
      el.style.position="fixed";
      el.style.left=x+"px";
      el.style.top=y+"px";
      el.style.zIndex="7000";
      el.style.pointerEvents="none";
      el.style.color=Math.random()>.5 ? "#ef715d" : "#f4a261";
      el.style.fontSize=(Math.random()*18+8)+"px";
      el.style.transition="transform 1.6s ease,opacity 1.6s ease";
      el.style.transform="translate(-50%,-50%) scale(.5)";
      document.body.appendChild(el);

      const dx=(Math.random()-.5)*360;
      const dy=-(Math.random()*260+100);
      const rot=(Math.random()-.5)*700;

      requestAnimationFrame(()=>{
        el.style.transform=`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) rotate(${rot}deg) scale(1.4)`;
        el.style.opacity="0";
      });
      setTimeout(()=>el.remove(),1700);
    }
  }

  /* -----------------------------------------
     IMPRESS HER BUTTONS — FIXED
     Every button has a real click handler.
  ----------------------------------------- */
  const buttonFinale = $("#buttonFinale");
  const buttonFinaleTitle = $("#buttonFinaleTitle");
  const buttonFinaleText = $("#buttonFinaleText");

  const buttonMessages = {
    kissButton: {
      title: "One kiss, delivered.",
      text: "A very soft forehead kiss has officially reached you, Jaan. Close your eyes for two seconds and pretend I'm right there. 😇"
    },
    loveButton: {
      title: "I love you. Obviously.",
      text: "Two years later and somehow I still get that stupid happy feeling whenever I think about you. I would choose you again."
    },
    missButton: {
      title: "Come here, Jaan.",
      text: "If I could turn this button into a teleport button, I would. Until science catches up, here's a ridiculously big virtual hug."
    },
    hugButton: {
      title: "Hug received.",
      text: "The kind of hug where neither person lets go first. Stay here a little longer. You are safe with me. ♡"
    },
    complimentButton: {
      title: "Here's the truth:",
      text: "You are beautiful, adorable, slightly chaotic, and somehow my favorite person in the whole world. That combination is unfair."
    },
    secretButton: {
      title: "You found the secret.",
      text: "If I could rewind the last two years and live them all again, I wouldn't change the ending. It would still be you."
    }
  };

  function showButtonMessage(button){
    const item = buttonMessages[button.id];
    if(!item || !buttonFinale) return;

    // Immediate visual feedback so the click never feels dead.
    button.classList.add("button-hit");
    setTimeout(()=>button.classList.remove("button-hit"),500);

    const rect = button.getBoundingClientRect();
    sparkleBurst(rect.left + rect.width/2, rect.top + rect.height/2, 28);

    buttonFinaleTitle.innerHTML = `${item.title}<br><em>just for you.</em>`;
    buttonFinaleText.textContent = item.text;

    buttonFinale.classList.remove("reveal-message");
    void buttonFinale.offsetWidth;
    buttonFinale.classList.add("reveal-message");

    // Scroll only after the message is updated.
    requestAnimationFrame(()=>{
      buttonFinale.scrollIntoView({behavior:"smooth", block:"center"});
    });
  }

  ["kissButton","loveButton","missButton","hugButton","complimentButton","secretButton"]
    .forEach(id=>{
      const button = $("#"+id);
      if(button) button.addEventListener("click", ()=>showButtonMessage(button));
    });

  /* -----------------------------------------
     FOUR VIDEOS — MUSIC HANDOFF
  ----------------------------------------- */
  const memoryVideos = $$(".memory-video");
  const videoButtons = $$(".video-play");
  let musicWasPlayingBeforeVideo = false;

  function pauseMusicForVideo(){
    musicWasPlayingBeforeVideo = !!(audio && !audio.paused);
    if(musicWasPlayingBeforeVideo){
      audio.pause();
      if(soundBtn) soundBtn.textContent = "music paused ♫";
    }
  }

  async function resumeMusicAfterVideo(){
    if(musicWasPlayingBeforeVideo && typeof startMusic === "function"){
      await startMusic();
    }
    musicWasPlayingBeforeVideo = false;
  }

  memoryVideos.forEach((video,index)=>{
    const card=video.closest(".film-card");
    const play=videoButtons[index];
    if(!play) return;

    video.addEventListener("loadeddata",()=>{
      card?.classList.remove("video-missing");
    });

    video.addEventListener("error",()=>{
      card?.classList.add("video-missing");
      play.innerHTML="<span>▶</span>";
    });

    async function toggleVideo(){
      // Pause every other video.
      memoryVideos.forEach((other,otherIndex)=>{
        if(other!==video){
          other.pause();
          other.closest(".film-card")?.classList.remove("playing");
          if(videoButtons[otherIndex]) videoButtons[otherIndex].innerHTML="<span>▶</span>";
        }
      });

      if(video.paused){
        pauseMusicForVideo();

        try{
          await video.play();
        }catch(err){
          // Playback failed: restore music if it had been playing.
          await resumeMusicAfterVideo();
          card?.classList.add("video-missing");
          play.innerHTML="<span>▶</span>";
        }
      }else{
        video.pause();
      }
    }

    // The large custom Play button.
    play.addEventListener("click",async e=>{
      e.preventDefault();
      e.stopPropagation();
      await toggleVideo();
    });

    // Clicking the video itself also works.
    video.addEventListener("click",async e=>{
      e.preventDefault();
      await toggleVideo();
    });

    video.addEventListener("play",()=>{
      pauseMusicForVideo();
      card?.classList.add("playing");
      play.innerHTML="<span>Ⅱ</span>";
    });

    video.addEventListener("pause",()=>{
      card?.classList.remove("playing");
      play.innerHTML="<span>▶</span>";
    });

    video.addEventListener("ended",async()=>{
      card?.classList.remove("playing");
      play.innerHTML="<span>↻</span>";
      await resumeMusicAfterVideo();
      setTimeout(()=>play.innerHTML="<span>▶</span>",700);
    });
  });

  /* subtle click sparkles throughout site */
  document.addEventListener("click", e => {
    if(e.target.closest("button") || e.target.closest("a")) return;
    if(document.body.classList.contains("locked")) return;
    sparkleBurst(e.clientX,e.clientY,5);
  });


  /* -----------------------------------------
     POST-PASSWORD FLOWER BLOOM
  ----------------------------------------- */
  const welcomeBloom = $("#welcomeBloom");
  const flowerField = $("#flowerField");
  const enterMemory = $("#enterMemory");

  const flowerSymbols = ["🌸","🌷","🌼","🌺","🌻","🌹","💮","✿"];
  for(let i=0;i<48;i++){
    const flower = document.createElement("span");
    flower.className = "bloom-flower";
    flower.textContent = flowerSymbols[Math.floor(Math.random()*flowerSymbols.length)];
    flower.style.left = Math.random()*100 + "%";
    flower.style.top = (Math.random()*115 - 10) + "%";
    flower.style.fontSize = (Math.random()*22+12) + "px";
    flower.style.setProperty("--delay", (Math.random()*1.8) + "s");
    flower.style.setProperty("--drift", ((Math.random()-.5)*180) + "px");
    flower.style.setProperty("--spin", ((Math.random()-.5)*300) + "deg");
    flowerField.appendChild(flower);
  }

  function showWelcome(){
    welcomeBloom.classList.add("show");
    document.body.classList.add("locked");
    setTimeout(()=>sparkleBurst(innerWidth/2,innerHeight/2,55),350);
  }

  enterMemory.addEventListener("click",()=>{
    welcomeBloom.classList.add("leave");
    document.body.classList.remove("locked");
    setTimeout(()=>welcomeBloom.classList.add("hidden"),1100);
    startMusic();
    sparkleBurst(innerWidth/2,innerHeight/2,75);
  });

  /* -----------------------------------------
     LOVE QUEST — 3 CHOICES, NO WRONG ANSWERS
  ----------------------------------------- */
  const questContent = $("#questContent");
  const questStep = $("#questStep");
  const questHearts = $("#questHearts");
  const questMessage = $("#questMessage");
  const startQuest = $("#startQuest");

  let questRound = 0;
  let questChoices = [];

  const questRounds = [
    {
      title: "First… how should our evening begin?",
      subtitle: "Pick the one that sounds most like us.",
      choices: [
        ["🌅", "sunset walk", "Just us, talking about everything and nothing."],
        ["🍿", "movie + cuddles", "Blanket, snacks, and you stealing my side."],
        ["☕", "late-night café", "One table, two drinks, infinite conversations."]
      ]
    },
    {
      title: "Now choose our little adventure.",
      subtitle: "Imagine there's no clock today.",
      choices: [
        ["🚗", "random road trip", "No destination. Just music and your hand in mine."],
        ["🌸", "somewhere pretty", "Flowers, photos, and me pretending I'm not staring at you."],
        ["🎡", "fun date", "Laughing until our stomachs hurt. The best kind of tired."]
      ]
    },
    {
      title: "And finally… how should the night end?",
      subtitle: "This one is important, Jaan.",
      choices: [
        ["🌙", "under the stars", "A quiet sky and one very loud “I love you.”"],
        ["🤗", "one huge hug", "The kind where neither of us wants to let go."],
        ["🏠", "safe at home", "Comfort clothes, sleepy eyes, and “goodnight, love.”"]
      ]
    }
  ];

  function renderQuestRound(){
    const round = questRounds[questRound];
    questStep.textContent = `CHOICE ${String(questRound+1).padStart(2,"0")} / 03`;
    questHearts.textContent = "♡ ".repeat(questRound) + "♥ " + "♡ ".repeat(2-questRound);
    questContent.innerHTML = `
      <div class="quest-question">
        <span class="quest-number">0${questRound+1}</span>
        <h3>${round.title}</h3>
        <p>${round.subtitle}</p>
      </div>
      <div class="quest-options">
        ${round.choices.map((c,i)=>`
          <button class="quest-option" data-index="${i}">
            <span class="option-icon">${c[0]}</span>
            <span class="option-copy">
              <strong>${c[1]}</strong>
              <small>${c[2]}</small>
            </span>
            <i>↗</i>
          </button>
        `).join("")}
      </div>
    `;

    $$(".quest-option").forEach(btn=>{
      btn.addEventListener("click",()=>{
        const choice = round.choices[Number(btn.dataset.index)];
        questChoices.push(choice);
        btn.classList.add("chosen");
        sparkleBurst(btn.getBoundingClientRect().left+btn.offsetWidth/2,
          btn.getBoundingClientRect().top+btn.offsetHeight/2,15);

        setTimeout(()=>{
          if(questRound < questRounds.length-1){
            questRound++;
            renderQuestRound();
          }else{
            renderQuestResult();
          }
        },450);
      });
    });
  }

  function renderQuestResult(){
    questStep.textContent = "YOUR LITTLE DAY / ♡";
    questHearts.textContent = "♥ ♥ ♥";
    questMessage.textContent = "officially approved by your favorite idiot";

    const [one,two,three] = questChoices;
    questContent.innerHTML = `
      <div class="quest-result">
        <div class="result-sun">✦</div>
        <p class="result-kicker">JAAN'S PERFECT DAY</p>
        <h3>Our tiny<br><em>date story.</em></h3>
        <div class="result-route">
          <div><span>${one[0]}</span><strong>${one[1]}</strong></div>
          <b>↓</b>
          <div><span>${two[0]}</span><strong>${two[1]}</strong></div>
          <b>↓</b>
          <div><span>${three[0]}</span><strong>${three[1]}</strong></div>
        </div>
        <p class="result-note">
          Honestly? I don't care what we choose.<br>
          If you're there, it's already my favorite day.
        </p>
        <button class="quest-start" id="questAgain">choose again ♡</button>
      </div>
    `;

    sparkleBurst(innerWidth/2,innerHeight/2,80);
    $("#questAgain").addEventListener("click",()=>{
      questRound=0;
      questChoices=[];
      renderQuestRound();
    });
  }

  startQuest.addEventListener("click",()=>{
    questRound=0;
    questChoices=[];
    renderQuestRound();
  });

  /* keyboard */
  document.addEventListener("keydown", e => {
    if(e.key==="Escape"){
      closeModal();
      closeLightbox();
    }
  });
});

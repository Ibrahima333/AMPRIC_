let logo = document.querySelector(".logo")
let navar = document.querySelector(".navbar")
window.addEventListener("scroll",()=>{
    if (!logo || !navar) {
        return;
    }

    if  (window.scrollY == 0){
        logo.classList.remove("logo-lg");
        logo.classList.add("logo-sn");
        navar.classList.add("nav-sn");
        navar.classList.remove("nav-lg")
        
    }
    else {
        logo.classList.remove("logo-sn");
        logo.classList.add("logo-lg");
        navar.classList.add("nav-lg");
        navar.classList.remove("nav-sn")
    }
}, { passive: true })

// slider image ici

const section1 = document.querySelector(".section1");
const sliderStage = document.querySelector(".section1-slider");
const sliderLayers = document.querySelectorAll(".section1-slide");
const sliderDots = document.querySelectorAll(".slider-dot");

const liste_image = [
    "/static/image/img1.jpeg",
    "/static/image/img4.jpg",
    "/static/image/img6.jpg"
];
let index = 0;
let activeLayer = 0;
let sliderIntervalId = null;
let switchSlide = null;
let updateDots = null;

const startSlider = () => {
    if (
        sliderIntervalId ||
        !section1 ||
        !sliderStage ||
        sliderLayers.length !== 2 ||
        !switchSlide ||
        document.hidden
    ) {
        return;
    }

    sliderIntervalId = window.setInterval(switchSlide, 5500);
};

const stopSlider = () => {
    if (!sliderIntervalId) {
        return;
    }

    window.clearInterval(sliderIntervalId);
    sliderIntervalId = null;
};

if (section1 && sliderStage && sliderLayers.length === 2) {
    sliderLayers[0].style.backgroundImage = `url(${liste_image[0]})`;
    section1.style.backgroundImage = "none";

    const warmNextSlides = () => {
        liste_image.slice(1).forEach((imageUrl) => {
            const img = new Image();
            img.src = imageUrl;
        });
    };

    updateDots = () => {
        sliderDots.forEach((dot, dotIndex) => {
            dot.classList.toggle("is-active", dotIndex === index);
        });
    };

    switchSlide = () => {
        index = (index + 1) % liste_image.length;
        const nextLayer = activeLayer === 0 ? 1 : 0;

        sliderLayers[nextLayer].style.backgroundImage = `url(${liste_image[index]})`;
        sliderLayers[nextLayer].classList.add("is-active");
        sliderLayers[activeLayer].classList.remove("is-active");

        activeLayer = nextLayer;
        updateDots();
    };

    updateDots();

    if ("requestIdleCallback" in window) {
        window.requestIdleCallback(warmNextSlides, { timeout: 1800 });
    } else {
        window.setTimeout(warmNextSlides, 1200);
    }

    startSlider();
}

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        stopSlider();
    } else {
        startSlider();
    }
});


// partie du popup 
const button_popup = document.querySelector(".overlay-popup");
const togglePopupState = (isOpen) => {
    if (!button_popup) {
        return;
    }

    button_popup.classList.toggle("active-popup", isOpen);
    document.body.classList.toggle("popup-open", isOpen);

    if (isOpen) {
        stopSlider();
    } else {
        startSlider();
    }
};

const active_popup = ()=>{
    if (button_popup) {
        togglePopupState(!button_popup.classList.contains("active-popup"));
    }
};

window.active_popup = active_popup;

// le popup reste active s'il ya un message erreur et aussi gerer le temp d'affichage
const erreur = document.querySelector(".erreur") ;
if(erreur){
    togglePopupState(true);
    setTimeout(()=>{
        erreur.style.opacity= "0"
    },4000)
  }

const btn_success = document.querySelector(".success")
if(btn_success){
    setTimeout(()=>{
        btn_success.style.opacity= "0"
    },4000)
}


// gestion du numero de telephone s'il est valide ou pas 
function valide_numero(number) {
    // Supprime les espaces et vérifie le format
    const regex = /^[789]\d{7}$/;
    return regex.test(number);
}

const input_tel = document.getElementById("phone")
const erreur_tel = document.querySelector(".erreur_tel")
const btn_submit = document.querySelector(".submit-btn")

if (btn_submit) {
    btn_submit.disabled = true;
}

if (input_tel && erreur_tel && btn_submit) {
    input_tel.addEventListener("input",()=>{
    const tel = input_tel.value.trim();
    if (input_tel.value === ""){ erreur_tel.style.opacity = "0"; btn_submit.disabled = true;}
    else if (!valide_numero(tel)){ erreur_tel.style.opacity = "1";  btn_submit.disabled = true; }
    else {  erreur_tel.style.opacity = "0"; btn_submit.disabled = false;}

    })
}

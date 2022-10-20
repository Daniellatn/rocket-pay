import './styles/index.css';
import IMask from 'imask';

const ccBgcolor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgcolor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccBgcolor03 = document.querySelector(".cc-bg svg > g g:nth-child(3) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");


ccBgcolor01.setAttribute("fill", "pink");
ccBgcolor02.setAttribute("fill", "purple");



function setCardType(type) {
  const colors = {
    "visa": ["#333333", "#DFA43B", "#315881"],
    "mastercard": ["#333333", "#F79E1B", "#EB001B"],
    "elo": ["#FFCB05", "#EF4123", "#00A4E0"],
    "american-express": ["#0077A6", "#0077A6"],
    "hipercard": ["#822124", "#822124"],
    "default": ["#333333", "black", "gray"]
  }

  ccBgcolor01.setAttribute("fill", colors[type][0]);
  ccBgcolor02.setAttribute("fill", colors[type][1]);
  ccBgcolor03.setAttribute("fill", colors[type][2]);
  ccLogo.setAttribute("src", `cc-${type}.svg`);
}

setCardType("default");

globalThis.setCardType = setCardType;

const securityCode = document.querySelector('#security-code');
const securityCodePattern = {
  mask: "000"
}
const securityCodeMasked = IMask(securityCode, securityCodePattern);


const expirationDate = document.querySelector('#expiration-date');
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    }
  }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

const cardNumber = document.querySelector("#card-number");
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardType: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default",
    }
  ],
  dispatch: function(appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g,'');
    const foundMask = dynamicMasked.compiledMasks.find( ({regex}) => number.match(regex));

    return foundMask;
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

const addButton = document.querySelector("#add-card");
addButton.addEventListener("click", () => {
  alert("Cartão adicionado");
});

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
});

const cardHolder = document.querySelector("#card-holder");
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value");

  ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value;
});

securityCodeMasked.on("accept", () => {
  const ccSecurity = document.querySelector(".cc-security .value");
  ccSecurity.innerText = securityCodeMasked.value.length === 0 ? "123" : securityCodeMasked.value;
});

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardType;
  setCardType(cardType);
  const ccNumber = document.querySelector(".cc-number");
  ccNumber.innerText = cardNumberMasked.value.length === 0 ? "1234 5678 9012 3456" : cardNumberMasked.value;
});

expirationDateMasked.on("accept", () => {
  const ccExpiration = document.querySelector(".cc-expiration .value");
  ccExpiration.innerText = expirationDateMasked.value.length === 0 ? "02/32" : expirationDateMasked.value;
});
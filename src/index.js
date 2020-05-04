import './styles.css';
import '../node_modules/basiclightbox/dist/basicLightbox.min.css';
import getApiRequest from './apiService.js';
import templateListImages from './list-images-tamplate.hbs';
import * as basicLightbox from 'basiclightbox';
const debounce = require ('lodash.debounce');
const userKey = '16370030-8b42ef581aeaa0cd943bdfd1a';

const refs = {
  listOfImages: document.querySelector ('.list__images'),
  input: document.querySelector ('input[name="query"]'),
  button: document.querySelector ('.button-loader'),
  modalCard: document.querySelector ('.list__images'),
};

let numberOfPage = 1;
let keyWord;

refs.input.addEventListener ('input', debounce (handlerSearchingImages, 1000));
refs.button.addEventListener ('click', handlerNexPagesOfImages);
refs.modalCard.addEventListener ('click', openModalWindow);

function handlerSearchingImages (event) {
  if (event.data === '' || event.data === null) {
    refs.button.classList.remove ('visible');
    return;
  }
  refs.button.classList.remove ('visible');
  refs.listOfImages.innerHTML = '';
  numberOfPage = 1;
  keyWord = event.target.value;
  getApiRequest (keyWord, numberOfPage, userKey).then (data => {
    const markup = templateListImages (data);
    refs.listOfImages.insertAdjacentHTML ('beforeend', markup);
    refs.button.classList.add ('visible');
  });
}

function handlerNexPagesOfImages (event) {
  event.preventDefault ();
  numberOfPage += 1;
  const pageHeight =
    document.documentElement.offsetHeight - refs.button.clientHeight;

  getApiRequest (keyWord, numberOfPage, userKey).then (data => {
    refs.listOfImages.insertAdjacentHTML (
      'beforeend',
      templateListImages (data)
    );
    window.scrollTo ({
      top: pageHeight,
      behavior: 'smooth',
    });
  });
}

function openModalWindow (event) {
  const eventImg = event.target.srcset;
  const instance = basicLightbox.create (`<img src= ${eventImg}>`);
  if (event.target.tagName === 'IMG') {
    instance.show ();
  }
}

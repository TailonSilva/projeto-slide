import NavegacaoSlide from './js/slide.js';

const slide = new NavegacaoSlide('.slider', '.slide');
slide.inicio();
slide.adicinarNavegacao('.anterior', '.proximo');
slide.addControles('.controle');

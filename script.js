import NavegacaoSlide from './js/slide.js';

const slide = new NavegacaoSlide('.box-slide', '.slide');
slide.inicio();
slide.adicinarNavegacao('.anterior', '.proximo');
slide.addControles('.controle');

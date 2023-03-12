import debounce from './debounce.js';

class Slide {
  constructor(slider, slide) {
    this.slider = document.querySelector(slider);
    this.slide = document.querySelector(slide);
    this.distancias = {
      posicaoFinal: 0,
      posicaoX: 0,
      movimento: 0,
      posicaoMovimento: 0,
    };
    this.eventos = {
      clica: 'mousedown',
      solta: 'mouseup',
      move: 'mousemove',
    };
    this.ativado = 'ativo';
    this.recebePosicaoX = '';
    this.mudaEvento = new Event('mudaEvento');
  }

  transicao(ativo) {
    this.slide.style.transition = ativo ? '.4s' : '';
  }

  eventoOcorrido(event) {
    if (event.type === 'mousedown') {
      console.log('Mouse');
    } else if (event.type === 'touchstart') {
      console.log('Touch');
    }
  }

  movimenta(distanciaX) {
    this.distancias.posicaoMovimento = distanciaX;
    this.slide.style.transform = `translate3D(${distanciaX}px,0,0)`;
  }

  atualizaPosicao(posicaoX) {
    this.distancias.movimento = (this.distancias.posicaoX - posicaoX) * 1.6;
    return this.distancias.posicaoFinal - this.distancias.movimento;
  }

  // CONTROLE DOS EVENTOS
  quandoClicar(event) {
    this.eventoOcorrido(event);
    this.distancias.posicaoX = event.clientX;
    this.slider.addEventListener(this.eventos.move, this.quandoMover);
    this.transicao(false);
  }

  quandoMover(event) {
    event.preventDefault();
    this.recebeX = event.clientX;
    const posicaoFinal = this.atualizaPosicao(this.recebeX);
    this.movimenta(posicaoFinal);
  }

  quandoSoltar(event) {
    this.slider.removeEventListener(this.eventos.move, this.quandoMover);
    this.distancias.posicaoFinal = this.distancias.posicaoMovimento;
    this.trocaSlideQuandoSoltar();
    this.transicao(true);
  }

  trocaSlideQuandoSoltar() {
    if (this.distancias.movimento > 120 && this.index.proximo !== undefined) {
      this.ativarProximoSlide();
    } else if (
      this.distancias.movimento < -120 &&
      this.index.antes !== undefined
    ) {
      this.ativarAnteriorSlide();
    } else {
      this.mudaSlide(this.index.atual);
    }
  }

  // ADICIONANDO OS EVENTOS
  addEventos() {
    this.slider.addEventListener(this.eventos.clica, this.quandoClicar);
    this.slider.addEventListener(this.eventos.solta, this.quandoSoltar);
  }

  //CONFIGURAÇÃO DOS SLIDES
  posicaoSlide(slide) {
    const margin = (this.slider.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin);
  }

  configuracaoSlides() {
    this.slideArray = [...this.slide.children].map((elemento) => {
      const posicao = this.posicaoSlide(elemento);
      return { elemento, posicao };
    });
  }

  slideIndexNav(index) {
    const ultimoSlide = this.slideArray.length - 1;
    this.index = {
      antes: index ? index - 1 : undefined,
      atual: index,
      proximo: index === ultimoSlide ? undefined : index + 1,
    };
  }

  mudaSlide(index) {
    const slideAtivo = this.slideArray[index];
    this.movimenta(slideAtivo.posicao);
    this.slideIndexNav(index);
    this.distancias.posicaoFinal = slideAtivo.posicao;
    this.transicao(true);
    this.classAtivo();
    this.slider.dispatchEvent(this.mudaEvento);
  }

  classAtivo() {
    this.slideArray.forEach((item) =>
      item.elemento.classList.remove(this.ativado),
    );
    this.slideArray[this.index.atual].elemento.classList.add(this.ativado);
  }

  //NAVEGAÇÃO DE SLIDES
  ativarAnteriorSlide() {
    if (this.index.antes !== undefined) this.mudaSlide(this.index.antes);
  }

  ativarProximoSlide() {
    if (this.index.proximo !== undefined) this.mudaSlide(this.index.proximo);
  }

  //EVENTO DE RESIZE

  redimencionarTela(event) {
    setTimeout(() => {
      this.configuracaoSlides();
      this.mudaSlide(this.index.atual);
    }, 500);
  }

  eventoRedimencionarTela(event) {
    window.addEventListener('resize', this.redimencionarTela);
  }

  bindDosEventos() {
    this.eventoOcorrido = this.eventoOcorrido.bind(this);
    this.quandoClicar = this.quandoClicar.bind(this);
    this.quandoMover = this.quandoMover.bind(this);
    this.quandoSoltar = this.quandoSoltar.bind(this);
    this.redimencionarTela = debounce(this.redimencionarTela.bind(this), 200);
    this.ativarAnteriorSlide = this.ativarAnteriorSlide.bind(this);
    this.ativarProximoSlide = this.ativarProximoSlide.bind(this);
  }

  inicio() {
    this.bindDosEventos();
    this.addEventos();
    this.configuracaoSlides();
    this.eventoRedimencionarTela();
    this.mudaSlide(0);
    return this;
  }
}

export default class NavegacaoSlide extends Slide {
  constructor(slider, slide) {
    super(slider, slide);
    this.bindDosControles();
  }

  adicinarNavegacao(antes, proximo) {
    this.elementoAnterior = document.querySelector(antes);
    this.elementoProximo = document.querySelector(proximo);
    this.eventosNavegacao();
  }

  eventosNavegacao() {
    this.elementoAnterior.addEventListener('click', this.ativarAnteriorSlide);
    this.elementoProximo.addEventListener('click', this.ativarProximoSlide);
  }

  criarControles() {
    const controle = document.createElement('ul');
    controle.dataset.control = 'slide';
    this.slideArray.forEach((item, index) => {
      controle.innerHTML += `<li><a href='#slide${index + 1}'>${
        index + 1
      }</a></li>`;
    });
    this.slider.appendChild(controle);
    return controle;
  }

  controleEventos(item, index) {
    item.addEventListener('click', (event) => {
      event.preventDefault;
      this.mudaSlide(index);
    });
    this.slider.addEventListener('mudaEvento', this.ativaClasseDoControle);
  }

  ativaClasseDoControle() {
    this.controleArray.forEach((item) => {
      item.classList.remove(this.ativado);
    });
    this.controleArray[this.index.atual].classList.add(this.ativado);
  }

  addControles(novoControle) {
    this.controle =
      document.querySelector(novoControle) || this.criarControles();
    this.controleArray = [...this.controle.children];

    this.ativaClasseDoControle();
    this.controleArray.forEach(this.controleEventos);
  }

  bindDosControles() {
    this.controleEventos = this.controleEventos.bind(this);
    this.ativaClasseDoControle = this.ativaClasseDoControle.bind(this);
  }
}

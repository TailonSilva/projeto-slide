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
      clica: '',
      solta: '',
      move: '',
    };
    this.ativado = 'ativo';
  }

  transicao(ativo) {
    this.slide.style.transition = ativo ? '.4s' : '';
  }

  eventoOcorrido(event) {
    this.eventos.clica = 'mousedown';
    this.eventos.solta = 'mouseup';
    this.eventos.move = 'mousemove';
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
    this.distancias.posicaoX = event.clientX;
    this.slider.addEventListener(this.eventos.move, this.quandoMover);
    this.transicao(false);
  }

  quandoMover(event) {
    event.preventDefault();
    const posicaoFinal = this.atualizaPosicao(event.clientX);
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
    this.eventoOcorrido();
    this.bindDosEventos();
    this.addEventos();
    this.configuracaoSlides();
    this.eventoRedimencionarTela();
    this.mudaSlide(0);
    return this;
  }
}

export default class NavegacaoSlide extends Slide {
  adicinarNavegacao(antes, proximo) {
    this.elementoAnterior = document.querySelector(antes);
    this.elementoProximo = document.querySelector(proximo);
    this.eventosNavegacao();
  }

  eventosNavegacao() {
    this.elementoAnterior.addEventListener('click', this.ativarAnteriorSlide);
    this.elementoProximo.addEventListener('click', this.ativarProximoSlide);
  }
}

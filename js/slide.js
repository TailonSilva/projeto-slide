export default class Slide {
  constructor(slider, slide) {
    this.slider = document.querySelector(slider);
    this.slide = document.querySelector(slide);
    this.distancias = {
      posicaoFinal: 0,
      posicaoX: 0,
      movimento: 0,
      posicaoMovimento: 0,
    };
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
    event.preventDefault();
    this.distancias.posicaoX = event.clientX;
    console.log(this.distancias.posicaoX);
    this.slider.addEventListener('mousemove', this.quandoMover);
  }

  quandoMover(event) {
    const posicaoFinal = this.atualizaPosicao(event.clientX);
    this.movimenta(posicaoFinal);
  }

  quandoSoltar() {
    this.slider.removeEventListener('mousemove', this.quandoMover);
    this.distancias.posicaoFinal = this.distancias.posicaoMovimento;
    console.log(this.distancias.posicaoFinal);
  }

  // ADICIONANDO OS EVENTOS
  addEventos() {
    this.slider.addEventListener('mousedown', this.quandoClicar);
    this.slider.addEventListener('mouseup', this.quandoSoltar);
  }

  bindDosEventos() {
    this.quandoClicar = this.quandoClicar.bind(this);
    this.quandoMover = this.quandoMover.bind(this);
    this.quandoSoltar = this.quandoSoltar.bind(this);
  }

  inicio() {
    this.bindDosEventos();
    this.addEventos();
    return this;
  }
}

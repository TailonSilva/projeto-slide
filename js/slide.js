export default class Slide {
  constructor(slider, slide) {
    this.slider = document.querySelector(slider);
    this.slide = document.querySelector(slide);
  }

  // CONTROLE DOS EVENTOS
  quandoClicar(event) {
    event.preventDefault();
    console.log('clicou');
    this.slider.addEventListener('mousemove', this.quandoMover);
  }

  quandoMover(event) {
    console.log('moveu');
  }

  quandoSoltar() {
    console.log('soltou');
    this.slider.removeEventListener('mousemove', this.quandoMover);
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

export class GameProgression {
  constructor() {
    this.highScores = JSON.parse(localStorage.getItem('highScores')) || { identificacion: 0, negociacion: 0, soborno: 0 };
  }
  
  updateHighScore(strategy, score) {
    if (score > this.highScores[strategy]) {
      this.highScores[strategy] = score;
      localStorage.setItem('highScores', JSON.stringify(this.highScores));
    }
  }
  
  getHighScores() {
    return this.highScores;
  }
}

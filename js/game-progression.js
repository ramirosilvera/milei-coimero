export class GameProgression {
  constructor() {
    this.highScores = JSON.parse(localStorage.getItem('highScores')) || { boicot: 0, influencia: 0, campaña: 0 };
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

export default class DrawingHistory {
  constructor(initialHistory = [[]], initialStep = 0) {
    this.history = initialHistory;
    this.step = initialStep;
  }

  getCurrentShapes() {
    return this.history[this.step] || [];
  }

  commit(newShapes, replace = false) {
    const newHistory = this.history.slice(0, replace ? this.step : this.step + 1);
    newHistory.push(newShapes);
    return new DrawingHistory(newHistory, newHistory.length - 1);
  }

  undo() {
    if (this.step > 0) {
      return new DrawingHistory(this.history, this.step - 1);
    }
    return this;
  }

  redo() {
    if (this.step < this.history.length - 1) {
      return new DrawingHistory(this.history, this.step + 1);
    }
    return this;
  }

  canUndo() {
    return this.step > 0;
  }

  canRedo() {
    return this.step < this.history.length - 1;
  }
}

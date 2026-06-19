export class Transaction {
  constructor(initialHistory) {
    this.initialHistory = initialHistory; // A DrawingHistory instance representing the state before transaction
    this.operations = [];
    this.isActive = false;
  }

  begin() {
    if (this.isActive) {
      throw new Error("Transaction is already active.");
    }
    this.isActive = true;
    this.operations = [];
  }

  addOperation(operationFn) {
    if (!this.isActive) {
      throw new Error("Cannot add operation: transaction is not active.");
    }
    // operationFn should take the current shapes array and return a new shapes array
    this.operations.push(operationFn);
  }

  commit(currentHistory) {
    if (!this.isActive) {
      throw new Error("Cannot commit: transaction is not active.");
    }

    // Starting with the shapes at the beginning of the transaction
    let currentShapes = [...this.initialHistory.getCurrentShapes()];

    for (const op of this.operations) {
      currentShapes = op(currentShapes);
    }

    this.isActive = false;

    // Return a new history state by committing the accumulated shapes
    // We can replace=false to push a single new step to history encompassing all ops
    return currentHistory.commit(currentShapes, false);
  }

  rollback() {
    if (!this.isActive) {
      throw new Error("Cannot rollback: transaction is not active.");
    }
    this.operations = [];
    this.isActive = false;
    return this.initialHistory; // Restore initial state
  }
}

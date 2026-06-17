export default class Shape {
  constructor(props) {
    this.type = 'shape';
    this.color = props.color || '#000000';
    this.fillPattern = props.fillPattern || null;
    this.patternScale = props.patternScale || 1;
    this.patternSpacing = props.patternSpacing || 0;
    this.patternLayout = props.patternLayout || 'grid';
    this.customPatternSvg = props.customPatternSvg || null;
  }

  update(updates) {
    Object.assign(this, updates);
    return this;
  }

  clone() {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }
}

export default class Shape {
  constructor(props) {
    this.type = 'shape';
    this.color = props.color || '#000000';
    this.fillColor = props.fillColor || null;
    this.fillPattern = props.fillPattern || null;
    this.patternScale = props.patternScale || 1;
    this.patternSpacing = props.patternSpacing || 0;
    this.patternLayout = props.patternLayout || 'grid';
    this.customPatternSvg = props.customPatternSvg || null;
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.rotation = props.rotation || 0;
    this.scaleX = props.scaleX !== undefined ? props.scaleX : 1;
    this.scaleY = props.scaleY !== undefined ? props.scaleY : 1;
  }

  update(updates) {
    Object.assign(this, updates);
    return this;
  }

  clone() {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }
}

import Shape from './Shape';

export default class Ellipse extends Shape {
  constructor(props) {
    super(props);
    this.type = 'ellipse';
    this.cx = props.cx || 0;
    this.cy = props.cy || 0;
    this.rx = props.rx || 0;
    this.ry = props.ry || 0;
    this.angle = props.angle || 0;
  }
}

import Shape from './Shape';

export default class Path extends Shape {
  constructor(props) {
    super(props);
    this.type = props.type || 'bezierPath'; // bezierPath or rawPath
    this.d = props.d || null;
    this.points = props.points || [];
  }
}

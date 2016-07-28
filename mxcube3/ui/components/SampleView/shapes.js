import 'fabric';
const fabric = window.fabric;

export function makeCircle(x, y, selectable, radius, color = 'red', id = 'no id', type = 'TMP') {
  return new fabric.Circle({
    radius,
    strokeWidth: 2,
    stroke: color,
    fill: '',
    left: x,
    top: y,
    selectable,
    lockMovementX: true,
    lockMovementY: true,
    lockScalingFlip: true,
    lockScalingX: true,
    lockScalingY: true,
    type,
    originX: 'center',
    originY: 'center',
    id
  });
}

export function makeLine(x1, y1, x2, y2, color, width) {
  return new fabric.Line([x1, y1, x2, y2], {
    fill: color,
    stroke: color,
    strokeWidth: width,
    selectable: false
  });
}

export function makeText(x, y, fontSize, color, text) {
  return new fabric.Text(text, {
    fontSize,
    fill: color,
    stroke: color,
    left: x,
    top: y,
    selectable: false
  });
}

export function makeScale(height, scaleLength, color, text) {
  return [
    makeLine(10, height - 10, scaleLength + 10, height - 10, 'green', 4),
    makeLine(10, height - 10, 10, height - 10 - scaleLength, 'green', 4),
    makeText(20, height - 30, 16, color, text)
  ];
}

export function makeCross(point, imageRatio, width, height) {
  return [
    makeLine(point.x / imageRatio, 0, point.x / imageRatio, height, 'yellow', 2),
    makeLine(0, point.y / imageRatio, width, point.y / imageRatio, 'yellow', 2)
  ];
}

export function makeBeam(x, y, radius) {
  return [
    makeLine(x - 20, y, x + 20, y, 'red', 1),
    makeLine(x, y - 20, x, y + 20, 'red', 1),
    makeCircle(x, y, false, radius, 'blue')
  ];
}

export function makeDistanceLine(p1, p2, iR, ppMm, color, width) {
  const a = p1.x - p2.x;
  const b = p1.y - p2.y;
  const length = parseInt(Math.sqrt(a * a + b * b) / ppMm * 1000, 10);
  return [
    makeLine(p1.x / iR, p1.y / iR, p2.x / iR, p2.y / iR, color, width),
    makeText(p2.x / iR, p2.y / iR, 12, color, `${length} µm`)
  ];
}

export function makePoint(x, y, id, color, type) {
  return [
    makeCircle(x, y, true, 10, color, id, type),
    makeText(x + 10, y - 25, 14, color, `P${id}`)
  ];
}


export function renderPoints(points, imageRatio) {
  const fabricPoints = [];
  for (const id in points) {
    if ({}.hasOwnProperty.call(points, id)) {
      switch (points[id].type) {
        case 'SAVED':
          fabricPoints.push(
            ...makePoint(points[id].x / imageRatio,
              points[id].y / imageRatio, id,
              'yellow',
              'SAVED'
            )
          );
          break;
        case 'TMP':
          fabricPoints.push(
            ...makePoint(
              points[id].x / imageRatio,
              points[id].y / imageRatio,
              id,
              'white',
              'TMP'
            )
          );
          break;
        default:
          throw new Error('Server gave point with unknown type');
      }
    }
  }
  return fabricPoints;
}

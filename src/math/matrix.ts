const RAD2DEG = 180 / Math.PI;

// TODO: Write some unit tests.

/** Given a matrix, determines the angle of rotation, in degrees. */
export function getRotationDegrees(matrix) {
  // This math is taken from:
  // https://stackoverflow.com/questions/16359246/how-to-extract-position-rotation-and-scale-from-matrix-svg
  let {a, b, c, d} = matrix;

  const scaleX = Math.sqrt(a * a + b * b);
  if (scaleX) {
    a /= scaleX;
    b /= scaleX;
  }

  const skewX = a * c + b * d;
  if (skewX) {
    c -= a * skewX;
    d -= b * skewX;
  }

  const scaleY = Math.sqrt(c * c + d * d);
  if (scaleY) {
    c /= scaleY;
    d /= scaleY;
  }

  if (a * d < b * c) {
    a = -a;
    b = -b;
  }

  return Math.atan2(b, a) * RAD2DEG;  
}

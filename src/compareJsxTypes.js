export default function compareJsxTypes(left, right){
  if (left === right) return true;

  // make sure left is the string if only one is
  if (typeof left === 'function' && typeof right === 'string') {
    [left, right] = [right, left];
  }

  if (typeof left === 'string' && typeof right === 'function') {
    if (left === right.name) return true;
    if (left.indexOf('c-') === 0 && left.slice(2) === right.name) return true;
  }

  return false;
}


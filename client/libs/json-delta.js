"use strict";
function isInsert(d) {
  return isArr(d[0]);
}
function isObj(o) {
  return o instanceof Object && !(o instanceof Array);
}
function isArr(o) {
  return o instanceof Array;
}
function shallowCopy(o) {
  if (isObj(o)) return Object.assign({}, o);
  if (isArr(o)) return o.slice();
  return o;
}
function getContainer(orig, result, path) {
  let len = path.length;
  if (!len) return undefined;
  let origContainer = orig;
  let container = result;
  if (container === origContainer) container = shallowCopy(origContainer);
  for (let i = 0; i < len - 1; ++i) {
    let seg = path[i];
    if (typeof seg === "number" && isArr(origContainer) && isArr(container)) {
      origContainer = origContainer[seg];
      if (container[seg] === origContainer) {
        container = container[seg] = shallowCopy(origContainer);
      } else {
        container = container[seg];
      }
    }
    if (typeof seg === "string" && isObj(origContainer) && isObj(container)) {
      origContainer = origContainer[seg];
      if (container[seg] === origContainer) {
        container = container[seg] = shallowCopy(origContainer);
      } else {
        container = container[seg];
      }
    }
  }
  return container;
}
function getVal(container, path) {
  let len = path.length;
  for (let i = 0; i < len; ++i) {
    let seg = path[i];
    if (typeof seg === "number" && isArr(container)) {
      container = container[seg];
    }
    if (typeof seg === "string" && isObj(container)) {
      container = container[seg];
    }
  }
  return container;
}
function applyDiff(o, d) {
  if (!d) return o;
  let result = shallowCopy(o);
  d.forEach(p => {
    if (isInsert(p)) result = applyInsert(o, result, p);
    else result = applyDelete(o, result, p);
  });
  return result;
}
function applyInsert(orig, result, insert) {
  let [path, val] = insert;
  let container = getContainer(orig, result, path);
  if (!container) return val;
  let key = path[path.length - 1];
  if (typeof key === "number" && isArr(container)) {
    container.splice(key, 0, val);
  }
  if (typeof key === "string" && isObj(container)) {
    container[key] = val;
  }
  return result;
}
function applyDelete(orig, result, path) {
  let container = getContainer(orig, result, path);
  if (!container) return null;
  let key = path[path.length - 1];
  if (typeof key === "number" && isArr(container)) {
    container.splice(key, 1);
    return result;
  }
  if (typeof key === "string" && isObj(container)) {
    delete container[key];
    return result;
  }
  return null;
}
function diff(a, b, tolerance = Infinity) {
  let result = [];
  if (gatherDiff(a, b, tolerance, [], result) || result.length > tolerance)
    return [[[], b]];
  if (result.length === 0) return null;
  return result;
}
function gatherDiff(a, b, tolerance = 3, path, result) {
  if (a === undefined) a = null;
  if (b === undefined) b = null;
  if (typeof a === "number" && isNaN(a)) a = null;
  if (typeof b === "number" && isNaN(b)) b = null;
  if (a === b) return false;
  if (typeof a !== typeof b) {
    result.push([path, b]);
    return false;
  }
  if (a instanceof Array) {
    if (!(b instanceof Array)) {
      result.push([path, b]);
      return false;
    }
    let offset = 0;
    const thunks = [];
    if (
      !arrDiff(
        a,
        b,
        tolerance - result.length,
        () => thunks.push(() => ++offset),
        (aIdx, bIdx) => thunks.push(() => result.push(path.concat([offset]))),
        (aIdx, bIdx) =>
          thunks.push(() => {
            result.push([path.concat([offset++]), b[bIdx]]);
          })
      )
    )
      return true;
    for (let i = thunks.length - 1; i >= 0; --i) {
      thunks[i]();
    }
    return false;
  }
  if (b instanceof Array) {
    result.push([path, b]);
    return false;
  }
  if (a instanceof Object) {
    if (!(b instanceof Object)) {
      result.push([path, b]);
      return false;
    }
    for (var k in a) {
      if (!(k in b)) {
        result.push(path.concat([k]));
        if (result.length > tolerance) {
          return true;
        }
        continue;
      }
      if (gatherDiff(a[k], b[k], tolerance, path.concat([k]), result)) {
        return true;
      }
      if (result.length > tolerance) {
        return true;
      }
    }
    for (var k in b) {
      if (!(k in a)) {
        result.push([path.concat([k]), b[k]]);
        if (result.length > tolerance) {
          return true;
        }
      }
    }
    return false;
  }
  result.push([path, b]);
  return false;
}
function deepEqual(a, b) {
  return a === b || diff(a, b, 0) == null;
}
/**
 * Finds the longest common subsequence between a and b,
 * optionally shortcutting any search whose removed elements
 * would exceed the provided tolerance value.
 * If there is no match within the provided tolerance, this function
 * returns null.
 */
function lcs(a, b, tolerance = a.length + b.length) {
  let result = [];
  return arrDiff(a, b, tolerance, aIdx => result.push(a[aIdx]))
    ? result.reverse()
    : null;
}
function arrDiff(
  a,
  b,
  tolerance = a.length + b.length,
  onEq,
  onPickA = () => null,
  onPickB = () => null
) {
  tolerance = Math.min(tolerance, a.length + b.length);
  let aLen = a.length;
  let bLen = b.length;
  let aOfDiagonal = new Uint32Array(tolerance * 2 + 2);
  let aOfDiagonalForEditSize = new Array(tolerance + 1);
  let shortestEdit = (function() {
    for (var d = 0; d <= tolerance; ++d) {
      for (var k = -d; k <= d; k += 2) {
        let aIdx;
        let takeB = aOfDiagonal[k + 1 + tolerance];
        let takeA = aOfDiagonal[k - 1 + tolerance];
        if (k === -d || (k !== d && takeA < takeB)) {
          aIdx = takeB;
        } else {
          aIdx = takeA + 1;
        }
        let bIdx = aIdx - k;
        while (aIdx < aLen && bIdx < bLen && deepEqual(a[aIdx], b[bIdx])) {
          aIdx++;
          bIdx++;
        }
        aOfDiagonal[k + tolerance] = aIdx;
        if (aIdx >= aLen && bIdx >= bLen) {
          aOfDiagonalForEditSize[d] = aOfDiagonal.slice();
          return [d, k];
        }
      }
      aOfDiagonalForEditSize[d] = aOfDiagonal.slice();
    }
    return null;
  })();
  if (shortestEdit) {
    let [d, k] = shortestEdit;
    let aIdx = aOfDiagonalForEditSize[d][k + tolerance];
    let bIdx = aIdx - k;
    while (d > 0) {
      let k = aIdx - bIdx;
      let v = aOfDiagonalForEditSize[d - 1];
      let prevK;
      if (
        k === -d ||
        (k !== d && v[k - 1 + tolerance] < v[k + 1 + tolerance])
      ) {
        prevK = k + 1;
      } else {
        prevK = k - 1;
      }
      let prevAIdx = v[prevK + tolerance];
      let prevBIdx = prevAIdx - prevK;
      while (aIdx > prevAIdx && bIdx > prevBIdx) {
        onEq(--aIdx, --bIdx);
      }
      if (aIdx > prevAIdx) {
        onPickA(--aIdx, bIdx);
      } else if (bIdx > prevBIdx) {
        onPickB(aIdx, --bIdx);
      }
      --d;
    }
    while (aIdx > 0 && bIdx > 0) {
      onEq(--aIdx, --bIdx);
    }
    return true;
  }
  return false;
}
const all = {
  isInsert,
  isObj,
  isArr,
  shallowCopy,
  getContainer,
  getVal,
  applyDiff,
  applyInsert,
  applyDelete,
  diff,
  gatherDiff,
  deepEqual,
  lcs,
  arrDiff
};
if (typeof module !== "undefined") {
  module.exports = all;
} else {
  window.jsonDelta = all;
}

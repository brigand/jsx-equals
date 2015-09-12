import {Children} from 'react';
import {inspect} from 'util';
import shallowDiff from 'shallow-diff';
import deepEquals from 'deep-equal';

const ANY = jsxEquals.ANY = function JsxEqualsAny(){};

export default function jsxEquals(original, template, opts={}, state={path: ''}){
  function makeError(msg, ...values){
    var res = msg.replace(/%(\d+)/g, (m, index) => {
      return inspect(values[index]);
    });

    res = `jsxEquals at path ${inspect(state.path)}: ${res}`;

    if (opts.noThrow) return new Error(res);
    else throw new Error(res);
  }

  if (typeof original === 'string' && typeof template === 'string') {
    return original === template;
  }

  opts.allowExtraProps = opts.allowExtraProps != null ? opts.allowExtraProps : true;
  const {allowExtraProps} = opts;

  // compare type
  if (template.type !== ANY && original.type !== template.type) {
    return makeError('Types %0 and %1 are not equal', original.type, template.type);
  }

  // compare propsA
  const cleanProps = (props) => Object.keys(props).reduce((acc, key) => {
    if (key !== 'children' && key[0] !== '_') acc[key] = props[key];
    return acc;
  }, {});

  var propDiff = shallowDiff(cleanProps(template.props), cleanProps(original.props));
  if (allowExtraProps) {
    propDiff.added = [];
  }
  propDiff.updated = propDiff.updated.filter((key) => {
    return typeof template.props[key] !== 'function' && !deepEquals(template.props[key], original.props[key]);
  });
  if (propDiff.updated.length && propDiff.added.length || propDiff.updated.length || propDiff.deleted.length) {
    return makeError('Props don\'t match %0', {
      added: propDiff.deleted,
      updated: propDiff.updated,
      deleted: propDiff.added,
    });
  }


  const childrenToArray = (input) => {var out = []; Children.forEach(input, (x) => out.push(x)); return out};
  var childrenA = childrenToArray(original.props.children);
  var childrenB = childrenToArray(template.props.children);
  for (let i=0; i<childrenA.length; i++) {
    let childA = childrenA[i];
    let childB = childrenB[i];

    // FIXME: handle ANY here somehow
    const type = childA.type && childA.type
      ? childA.type.name ? childA.type.name : childA.type
      : `[[${typeof childA}]]`;
    let res = jsxEquals(childA, childB, opts, {
      path: `${state.path}.${type}`
    });
    if (res instanceof Error) return res;
  }

  return true;
}



import React from 'react';
import jsxEquals from '../src/';
import {expect} from 'chai';

const jsxNotEquals = (...args) => {
  expect(() => jsxEquals(...args)).to.throw();
}

describe('jsxEquals', () => {
  it('works for truthy case', () => {
    jsxEquals(<div />, <div />);
    jsxEquals(<div id="foo" />, <div />);
    jsxEquals(
      <div className="foo" />,
      <div className="foo" />
    );
    jsxEquals(
      <div className="foo"><span>foo</span></div>,
      <div className="foo"><span>foo</span></div>
    );

    var C1 = function C1(){};
    var C2 = function C2(){};
    jsxEquals(
      <div>
        Kitchen {'sink'}
        <span data-foo="bar">
          <table>
            <tr><td /></tr>
            <tr><td><C2 /></td></tr>
            <tr><td /></tr>
          </table>
        </span>
        <C1>
          <input value="foo" onChange={() => {}} />
        </C1>
      </div>,
      <div>
        Kitchen {'sink'}
        <span data-foo="bar">
          <table>
            <tr><td /></tr>
            <tr><td><C2 /></td></tr>
            <tr><td /></tr>
          </table>
        </span>
        <C1>
          <input value="foo" onChange={() => {}} />
        </C1>
      </div>
    );
  });

  it('fails for falsy cases', () => {
    jsxNotEquals(<div />, <div id="x" />);
    jsxNotEquals(
      <div className="foo" />,
      <div className="bar" />
    );
    jsxNotEquals(
      <div className="foo"><span>foo</span></div>,
      <span className="foo"><span>foo</span></span>
    );
    jsxNotEquals(
      <div className="foo"><span>foo</span></div>,
      <div className="foo"><p>foo</p></div>
    );

    var C1 = function C1(){};
    var C2 = function C2(){};
    // div > span > table > tr:nth(2) > td > C2 changed to C1
    jsxNotEquals(
      <div>
        Kitchen {'sink'}
        <span data-foo="bar">
          <table>
            <tr><td /></tr>
            <tr><td><C2 /></td></tr>
            <tr><td /></tr>
          </table>
        </span>
        <C1>
          <input value="foo" onChange={() => {}} />
        </C1>
      </div>,
      <div>
        Kitchen {'sink'}
        <span data-foo="bar">
          <table>
            <tr><td /></tr>
            <tr><td><C1 /></td></tr>
            <tr><td /></tr>
          </table>
        </span>
        <C1>
          <input value="foo" onChange={() => {}} />
        </C1>
      </div>
    );
  });

  it('works with deep properties', () => {
    jsxEquals(
      <div x={{x: 1}} />,
      <div x={{x: 1}} />
    );
  });

  it('works with ANY', () => {
    jsxEquals(<div />, <jsxEquals.ANY />);
  });

});



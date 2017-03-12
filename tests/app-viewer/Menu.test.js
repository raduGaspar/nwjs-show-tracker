// import React from 'react';
import { mount, shallow } from 'enzyme';
import freeze from 'deep-freeze';
import { expect } from 'chai';
import {
  toggleMenu,
} from '../../src/modules/app-viewer/actions';
import menu from '../../src/modules/app-viewer/reducers/menu';

const evaluate = (initialState, expectedState, type) => {
  Object.keys(expectedState).forEach((key) => {
    if (typeof expectedState[key] === 'object') {
      expect(menu(freeze(initialState), type))
        .to.have.deep.property(key)
        .to.be.an('object')
        .to.deep.equal(expectedState[key]);
    } else {
      expect(menu(freeze(initialState), type))
        .to.have.deep.property(key, expectedState[key]);
    }
  });
};

describe('Menu toggle', () => {
  it('should switch from visible true to visible false', () => {
    evaluate({ visible: true }, { visible: false }, toggleMenu());
  });
  it('should switch from visible false to visible true', () => {
    evaluate({ visible: false }, { visible: true }, toggleMenu());
  });
});

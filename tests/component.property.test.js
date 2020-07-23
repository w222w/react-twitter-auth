import React from 'react';
import TwitterLogin from '../src';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Twitter Login Component', () => {

  let component;
  let propsObj;

  describe('With default props',() => {
    beforeEach(() => {
      propsObj = {
        onSuccess: (response) => {},
        onFailure: (error) => {},
        loginUrl: 'http://localhost:3000/login-url',
        requestTokenUrl: 'http://localhost:3000/request-token'
      };
      component = mount(<TwitterLogin {...propsObj}/>);
    });

    it('shows the button', () => {
      expect(component).to.exist;
    });

    it('displays correct button default values', () => {
      expect(component.props().text).to.equal('Sign in with Twitter');
      expect(component.props().tag).to.equal('button');
      expect(component.props().disabled).to.equal(false);
      expect(component.props().dialogWidth).to.equal(600);
      expect(component.props().dialogHeight).to.equal(400);
    });



  })
});

import React from 'react';
import ReactDOM from 'react-dom';
import TwitterLogin from '../src';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('TwitterLogin', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TwitterLogin onSuccess={()=>{}} onFailure={()=>{}}/>, div);
  });
});


import React from 'react';
import assert from 'assert';
import jsdom from 'jsdom';
import { mount } from 'enzyme';
// import lib from '../src';

describe('library', function () {
	beforeEach(() => {
		global.document = jsdom.jsdom(
			'<!doctype html><html><body></body></html>'
		);
		if (typeof window === 'undefined') {
			global.window = global.document.defaultView;
			global.navigator = global.window.navigator;
		}
	});

	it('task', function () {
		const text = 'hello world';
		const App = () => (<div>{text}</div>);
		const wrapper = mount(<App />);
		assert(wrapper.find('div').text(), text);
	});
});

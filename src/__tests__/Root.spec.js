import React from 'react';
import { shallow } from 'enzyme';
import { unwrap } from '@material-ui/core/test-utils';
import Root from '../Root.component';
import { getD2Stub } from '../utils/testing'
import MenuItem from '@material-ui/core/MenuItem';

const _Root = unwrap(Root);

describe('Landing page', () => {
    const renderWithProps = props =>
        shallow(<_Root d2={getD2Stub()} classes={{}} {...props} />);

    it('renders 4 menu items', () => {
        const component = renderWithProps()
        expect(component.find(MenuItem)).toHaveLength(4)
    });
});

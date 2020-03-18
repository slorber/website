import React from 'react';

import renderer from 'react-test-renderer';

import TechTalkSection from '.';

it('TechTalkSection matches snapshot.', () => {
  const tree = renderer.create(<TechTalkSection />).toJSON();
  expect(tree).toMatchSnapshot();
});

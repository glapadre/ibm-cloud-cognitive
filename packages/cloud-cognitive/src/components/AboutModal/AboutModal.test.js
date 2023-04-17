/**
 * Copyright IBM Corp. 2021, 2021
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// cspell:words grafana

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { pkg } from '../../settings';

import uuidv4 from '../../global/js/utils/uuidv4';

import { Link } from '@carbon/react';
import { AboutModal } from '.';

import ExampleLogo from './_story-assets/example-logo.svg';

const blockClass = `${pkg.prefix}--about-modal`;
const componentName = AboutModal.displayName;

const className = `class-${uuidv4()}`;
const closeIconDescription = `close ${uuidv4()}`;
const content = `This is example content: ${uuidv4()}`;
const copyrightText = `Copyright test text ${uuidv4()}`;
const dataTestId = uuidv4();
const logoAltText = `Example product ${uuidv4()} logo`;
const logo = (
  <img src={ExampleLogo} alt={logoAltText} style={{ maxWidth: '6rem' }} />
);
const generalText = `Legal test text ${uuidv4()}`;
const linkText = `Carbon (${uuidv4()}) Design System`;
const linkHref = `https://www.carbondesignsystem.com/${uuidv4()}`;
const links = [
  <Link href={linkHref} key="link1">
    {linkText}
  </Link>,
  <Link href="https://www.ibm.com/design/language" key="link2">
    IBM Design Language
  </Link>,
];
const onCloseReturnsTrue = jest.fn(() => true);
const onCloseReturnsFalse = jest.fn(() => false);
const titleText = `Watson ${uuidv4()} Ops`;
const title = (
  <>
    IBM <span>{titleText}</span>
  </>
);

// render an AboutModal with content, logo, title, and any other required props
const renderComponent = ({ ...rest }) =>
  render(
    <main>
      <AboutModal
        {...{ closeIconDescription, content, logo, title, ...rest }}
        modalAriaLabel="About this product"
      />
    </main>
  );

describe(componentName, () => {
  const { ResizeObserver } = window;

  beforeEach(() => {
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
    window.ResizeObserver = ResizeObserver;
  });

  it('renders a component AboutModal', () => {
    renderComponent({ open: true });
    expect(screen.getByRole('presentation')).toHaveClass(blockClass);
  });

  it.skip('has no accessibility violations', async () => {
    const { container } = renderComponent();
    await expect(container).toBeAccessible(componentName);
    await expect(container).toHaveNoAxeViolations();
  });

  it('renders closeIconDescription, title, logo, and content', () => {
    renderComponent({ open: true });
    screen.getByRole('button', { name: closeIconDescription });
    screen.getByText(titleText);
    screen.getByText(content);
    screen.getByAltText(logoAltText);
  });

  it('renders with links', () => {
    renderComponent({ links, open: true });
    const link = screen.getByRole('link', { name: linkText });
    expect(link.href).toEqual(linkHref);
  });

  it('renders general text', () => {
    renderComponent({ generalText, open: true });
    screen.getByText(generalText);
  });

  it('renders copyright text', () => {
    renderComponent({ copyrightText, open: true });
    screen.getByText(copyrightText);
  });

  it('is visible when open is true', () => {
    renderComponent({ open: true });
    expect(screen.getByRole('presentation')).toHaveClass('is-visible');
  });

  it('is not visible when open is not true', () => {
    const { container } = renderComponent({ open: false });
    expect(container.firstChild).not.toHaveClass('is-visible');
  });

  it('applies className to the root node', () => {
    renderComponent({ className, open: true });
    expect(screen.getByRole('presentation')).toHaveClass(className);
  });

  it('calls onClose() when modal is closed', () => {
    renderComponent({ open: true, onClose: onCloseReturnsTrue });
    const aboutModal = screen.getByRole('presentation');
    const closeButton = screen.getByRole('button', {
      name: closeIconDescription,
    });
    expect(aboutModal).toHaveClass('is-visible');
    expect(onCloseReturnsTrue).toHaveBeenCalledTimes(0);
    userEvent.click(closeButton);
    expect(onCloseReturnsTrue).toHaveBeenCalledTimes(1);
  });

  it('allows veto when modal is closed', () => {
    renderComponent({ open: true, onClose: onCloseReturnsFalse });
    const aboutModal = screen.getByRole('presentation');
    const closeButton = screen.getByRole('button', {
      name: closeIconDescription,
    });
    expect(aboutModal).toHaveClass('is-visible');
    expect(onCloseReturnsFalse).toHaveBeenCalledTimes(0);
    userEvent.click(closeButton);
    expect(aboutModal).toHaveClass('is-visible');
    expect(onCloseReturnsFalse).toHaveBeenCalledTimes(1);
  });

  it('adds additional properties to the containing node', () => {
    renderComponent({ 'data-testid': dataTestId });
    screen.getByTestId(dataTestId);
  });

  it('forwards a ref to an appropriate node', () => {
    const ref = React.createRef();
    renderComponent({ ref });
    expect(ref.current).toHaveClass(blockClass);
  });

  it('adds the Devtools attribute to the containing node', () => {
    renderComponent({ 'data-testid': dataTestId });

    expect(screen.getByTestId(dataTestId)).toHaveDevtoolsAttribute(
      componentName
    );
  });
});

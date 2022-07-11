// test/pages/index.test.js
<<<<<<< HEAD

import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import Home from "@pages/index";

describe('Home', () => {
  it('should render the heading', () => {
    render(<Home />);

    const heading = screen.getByText(/Next.js Template!/i);

    expect(heading).toBeInTheDocument();
    expect(heading).toMatchSnapshot();
  });

  it("should pass accessibility scan", async () => {
    const { container } = render(<Home />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  })
});
=======
import { axe } from 'jest-axe'
import { screen } from '@testing-library/react'
import Index from '../../src/pages/index'
import renderWithIntl from '../renderWithIntl'

describe('Index', () => {
  it('should render welcome text', () => {
    renderWithIntl(<Index />)

    const welcome = screen.getByText(/Welcome to your/i)

    expect(welcome).toBeInTheDocument()
    expect(welcome).toMatchSnapshot()
  })

  it('should pass accessibility scan', async () => {
    const { container } = renderWithIntl(<Index />)
    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
})
>>>>>>> template/karina/setup-template-layout

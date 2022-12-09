import { render, screen } from '@testing-library/react'

import TransLine from '@components/TransLine'

const alpha = 'https://external.com'
const beta = '/relative/link'

it('should render a string with no links or styles', () => {
  render(<TransLine i18nKey="test:transLine.plainString" />)
  expect(screen.getByText('just text')).toBeInTheDocument()
})

it('should render a string with one internal link and no styles', () => {
  render(<TransLine i18nKey="test:transLine.plainStringOneLink.text" />)
  expect(screen.getByRole('link', { name: 'second' })).toHaveAttribute(
    'href',
    alpha
  )
})

it('should render a string with multiple links and no styles', () => {
  render(<TransLine i18nKey="test:transLine.plainStringLinks.text" />)
  expect(screen.getByRole('link', { name: 'second' })).toHaveAttribute(
    'href',
    alpha
  )
  expect(screen.getByRole('link', { name: 'third' })).toHaveAttribute(
    'href',
    beta
  )
})

it('should render a string with multiple internal links reused links and out of order', () => {
  render(
    <TransLine i18nKey="test:transLine.plainStringLinksComplicated.text" />
  )
  expect(screen.getByRole('link', { name: 'second' })).toHaveAttribute(
    'href',
    alpha
  )
  expect(screen.getByRole('link', { name: 'fourth' })).toHaveAttribute(
    'href',
    alpha
  )
  expect(screen.getByRole('link', { name: 'first' })).toHaveAttribute(
    'href',
    beta
  )
  expect(screen.getByRole('link', { name: 'fifth' })).toHaveAttribute(
    'href',
    beta
  )
})

it('should render a string with no links, but with styles', () => {
  render(<TransLine i18nKey="test:transLine.styledString" />)
  expect(screen.getByText('first', { exact: false })).toBeInTheDocument()
  screen.getByText((content, element) => {
    return element === null
      ? false
      : element.tagName.toLowerCase() === 'strong' &&
          content.startsWith('second')
  })
  expect(screen.getByText('third', { exact: false })).toBeInTheDocument()
})

it('should render a string with one internal link and styles', () => {
  render(<TransLine i18nKey="test:transLine.styledStringOneLink.text" />)
  expect(screen.getByText('first', { exact: false })).toBeInTheDocument()
  screen.getByText((content, element) => {
    return element === null
      ? false
      : element.tagName.toLowerCase() === 'strong' &&
          content.startsWith('second')
  })
  expect(screen.getByRole('link', { name: 'third' })).toHaveAttribute(
    'href',
    alpha
  )
})

it('should render a string with a styled internal link', () => {
  render(<TransLine i18nKey="test:transLine.styledLink.text" />)
  expect(screen.getByText('first', { exact: false })).toBeInTheDocument()
  screen.getByText((content, element) => {
    return element === null ? false : element.tagName.toLowerCase() === 'strong'
  })
  expect(screen.getByRole('link', { name: 'second' })).toHaveAttribute(
    'href',
    alpha
  )
})

import { Trans } from 'next-i18next'
import { ChangeEvent, ReactElement } from 'react'

interface Props<T> {
  handleChange: (
    e: ChangeEvent<HTMLSelectElement> & { target: { value: T } }
  ) => void
  id: string
  labelKey: string
  options: string[]
  required?: boolean
}

// This component expects pre-translated option strings.
// @TODO: This should be refactored if its ever used with non-integer options.
const Dropdown = <T extends string>(props: Props<T>): ReactElement => {
  const { handleChange, id, labelKey, options, required } = props

  return (
    <>
      <label className="usa-label" htmlFor={id}>
        <Trans i18nKey={labelKey} />
        {required && <abbr className="usa-hint usa-hint--required"> *</abbr>}
      </label>
      <select className="usa-select" id={id} onChange={handleChange}>
        <option value={undefined}>
          &mdash;&nbsp;
          <Trans i18nKey="select" />
          &nbsp;&mdash;
        </option>
        {options.map((option: string) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  )
}

export default Dropdown

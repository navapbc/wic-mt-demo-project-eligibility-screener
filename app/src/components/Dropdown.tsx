import { ChangeEvent, ReactElement } from 'react'

import Required from '@components/Required'
import TransLine from '@components/TransLine'

import { I18nKey } from '@src/types'

export interface DropdownProps {
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void
  id: string
  labelKey: I18nKey
  options: string[]
  required?: boolean
  selectedOption?: string
}

// @TODO: This component expects pre-translated option strings.
//        It should be refactored if itos ever used with non-integer options.
const Dropdown = (props: DropdownProps): ReactElement => {
  const { handleChange, id, labelKey, options, required, selectedOption } =
    props

  return (
    <>
      <label className="usa-label" htmlFor={id}>
        <TransLine i18nKey={labelKey} />
        {required && <Required />}
      </label>
      <select
        className="usa-select"
        id={id}
        name={id}
        onChange={handleChange}
        value={selectedOption}
      >
        <option value="">
          -&nbsp;
          <TransLine i18nKey="select" />
          &nbsp;-
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

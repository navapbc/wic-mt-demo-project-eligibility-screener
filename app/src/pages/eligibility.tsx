import { ReactElement, useState } from 'react'
import type { NextPageWithLayout } from './_app'
import { useTranslations } from 'next-intl'
import styled from 'styled-components'

import Button from '../components/Button'

const Eligibility: NextPageWithLayout = () => {
  const t = useTranslations('Eligibility')
  const [residential, setResidential] = useState(null)
  const [pregnant, setPregnant] = useState(null)
  const [baby, setBaby] = useState(null)
  const [child, setChild] = useState(null)
  const [guardian, setGuardian] = useState(null)
  const [none, setNone] = useState(null)
  const [loss, setLoss] = useState(null)
  const [insurance, setInsurance] = useState(null)
  const [snap, setSnap] = useState(null)
  const [tanf, setTanf] = useState(null)
  const [none2, setNone2] = useState(null)

  const handleChange = (e) => {
    if (e.target.name === 'residential') {
      setResidential(e.target.value)
    } else if (e.target.name === 'pregnant') {
      pregnant ? setPregnant(null) : setPregnant(e.target.value)
    } else if (e.target.name === 'baby') {
      baby ? setBaby(null) : setBaby(e.target.value)
    } else if (e.target.name === 'child') {
      child ? setChild(null) : setChild(e.target.value)
    } else if (e.target.name === 'guardian') {
      guardian ? setGuardian(null) : setGuardian(e.target.value)
    } else if (e.target.name === 'none') {
      none ? setNone(null) : setNone(e.target.value)
    } else if (e.target.name === 'loss') {
      loss ? setLoss(null) : setLoss(e.target.value)
    } else if (e.target.name === 'insurance') {
      insurance ? setInsurance(null) : setInsurance(e.target.value)
    } else if (e.target.name === 'snap') {
      snap ? setSnap(null) : setSnap(e.target.value)
    } else if (e.target.name === 'tanf') {
      tanf ? setTanf(null) : setTanf(e.target.value)
    } else if (e.target.name === 'none2') {
      none2 ? setNone2(null) : setNone2(e.target.value)
    }
  }

  return (
    <>
      <Fieldset className="usa-fieldset">
        <h2>{t('residential')}</h2>
          <div className="usa-radio">
            <input
              className="usa-radio__input"
              id="yes"
              type="radio"
              value="yes"
              name="residential"
              checked={residential === "yes"}
              onChange={handleChange}
            />
            <label className="usa-radio__label" htmlFor="yes">Yes</label>
          </div>
          <div className="usa-radio">
            <input
              className="usa-radio__input"
              id="no"
              type="radio"
              name="residential"
              value="no"
              checked={residential === "no"}
              onChange={handleChange}
            />
            <label className="usa-radio__label" htmlFor="no">No</label>
          </div>
        </Fieldset>
        <br />
        <Fieldset className="usa-fieldset">
        <h2>{t('categorical')}</h2>
          <div className="usa-checkbox">
            <input
              className="usa-checkbox__input"
              id='pregnant'
              type="checkbox"
              value='pregnant'
              name="pregnant"
              onChange={handleChange}
              checked={pregnant === 'pregnant'}
            />
            <label className="usa-checkbox__label" htmlFor='pregnant'>{t('pregnant')}</label>
          </div>
          <div className="usa-checkbox">
            <input
              className="usa-checkbox__input"
              id='baby'
              type="checkbox"
              value='baby'
              name='baby'
              onChange={handleChange}
              checked={baby === 'baby'}
            />
            <label className="usa-checkbox__label" htmlFor='baby'>{t('baby')}</label>
          </div>
          <div className="usa-checkbox">
            <input
              className="usa-checkbox__input"
              id='child'
              type="checkbox"
              value='child'
              name='child'
              onChange={handleChange}
              checked={child === 'child'}
            />
            <label className="usa-checkbox__label" htmlFor='child'>{t('child')}</label>
          </div>
          <div className="usa-checkbox">
            <input
              className="usa-checkbox__input"
              id='guardian'
              type="checkbox"
              value='guardian'
              name='guardian'
              onChange={handleChange}
              checked={guardian === 'guardian'}
            />
            <label className="usa-checkbox__label" htmlFor='guardian'>{t('guardian')}</label>
          </div>
          <div className="usa-checkbox">
            <input
              className="usa-checkbox__input"
              id='none'
              type="checkbox"
              value='none'
              name='none'
              onChange={handleChange}
              checked={none === 'none'}
            />
            <label className="usa-checkbox__label" htmlFor='none'>{t('none')}</label>
          </div>
          <div className="usa-checkbox">
            <input
              className="usa-checkbox__input"
              id='loss'
              type="checkbox"
              value='loss'
              name='loss'
              onChange={handleChange}
              checked={loss === 'loss'}
            />
            <label className="usa-checkbox__label" htmlFor='loss'>{t('loss')}</label>
          </div>
        </Fieldset>
        <br />
        <Fieldset className="usa-fieldset">
        <h2>{t('programs')}</h2>
          <div className="usa-checkbox">
            <input
              className="usa-checkbox__input"
              id='insurance'
              type="checkbox"
              value='insurance'
              name='insurance'
              onChange={handleChange}
              checked={insurance === 'insurance'}
            />
            <label className="usa-checkbox__label" htmlFor='insurance'>{t('insurance')}</label>
          </div>
          <div className="usa-checkbox">
            <input
              className="usa-checkbox__input"
              id='snap'
              type="checkbox"
              value='snap'
              name='snap'
              onChange={handleChange}
              checked={snap === 'snap'}
            />
            <label className="usa-checkbox__label" htmlFor='snap'>{t('snap')}</label>
          </div>
          <div className="usa-checkbox">
            <input
              className="usa-checkbox__input"
              id='tanf'
              type="checkbox"
              value='tanf'
              name='tanf'
              onChange={handleChange}
              checked={tanf === 'tanf'}
            />
            <label className="usa-checkbox__label" htmlFor='tanf'>{t('tanf')}</label>
          </div>
          <div className="usa-checkbox">
            <input
              className="usa-checkbox__input"
              id='none2'
              type="checkbox"
              value='none2'
              name='none2'
              onChange={handleChange}
              checked={none2 === 'none2'}
            />
            <label className="usa-checkbox__label" htmlFor='none2'>{t('none')}</label>
          </div>
        </Fieldset>
        <br />
        <br />
        <br />
        <Button
          href='/'
          text={t('continue')}
          vector
          width="140px"
        />
    </>
  )
}

const Fieldset = styled.fieldset`
  border: none;
  h2 {
    font-family: 'Balsamiq Sans', cursive;
    font-weight: 300;
  }
  label {
    font-family: 'Balsamiq Sans', cursive;
    font-weight: 300;
  }
`

export default Eligibility
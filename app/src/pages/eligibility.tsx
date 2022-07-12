import { NextPage } from 'next'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import ButtonLink from '@components/ButtonLink'
import InputChoiceGroup from '@components/InputChoiceGroup'

const Eligibility: NextPage = () => {
  const t = useTranslations('Eligibility')
  const [form, setForm] = useState({
    residential: null,
    pregnant: false,
    baby: false,
    child: false,
    guardian: false,
    none: false,
    loss: false,
    insurance: false,
    snap: false,
    tanf: false,
    none2: false
  })

  const handleChange = (e: { target: HTMLInputElement }) => {
    const { value, name } = e.target
    let newValue = { [value]: !form[value] }

    if (name === 'residential') {
      newValue = {[name]: value}
    }

    setForm({
      ...form,
      ...newValue
    })
  }

  return (
    <form>
      <InputChoiceGroup
        title={t('residential')}
        type="radio"
        choices={[
          {
            checked: form.residential === 'yes',
            handleChange,
            label: 'Yes',
            name: 'residential',
            value: 'yes'
          },
          {
            checked: form.residential === 'no',
            handleChange,
            label: 'No',
            name: 'residential',
            value: 'no'
          }
        ]}
      />
      <br />
      <InputChoiceGroup
        title={t('categorical')}
        type="checkbox"
        choices={[
          {
            checked:form.pregnant,
            handleChange,
            label: t('pregnant'),
            value:'pregnant',
          },
          {
            checked: form.baby,
            handleChange,
            label: t('baby'),
            value: 'baby',
          },
          {
            checked: form.child,
            handleChange,
            label: t('child'),
            value: 'child',
          },
          {
            checked: form.guardian,
            handleChange,
            label: t('guardian'),
            value: 'guardian',
          },
          {
            checked: form.none,
            handleChange,
            label: t('none'),
            value: 'none',
          },
          {
            checked: form.loss,
            handleChange,
            label: t('loss'),
            value: 'loss',
          },
        ]}
      />
      <br />
      <InputChoiceGroup
        title={t('programs')}
        type="checkbox"
        choices={[
          {
            checked: form.insurance,
            handleChange,
            label: t('insurance'),
            value: 'insurance',
          },
          {
            checked: form.snap,
            handleChange,
            label: t('snap'),
            value: 'snap',
          },
          {
            checked: form.tanf,
            handleChange,
            label: t('tanf'),
            value: 'tanf',
          },
          {
            checked: form.none2,
            handleChange,
            label: t('none'),
            value: 'none2',
          },
        ]}
      />
      <br />
      <br />
      <br />
      <ButtonLink href="/" text={t('continue')} vector width="140px" />
    </form>
  )
}

export default Eligibility

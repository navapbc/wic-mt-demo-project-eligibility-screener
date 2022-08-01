import type { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ChangeEvent, useState } from 'react'

import ButtonLink from '@components/ButtonLink'
import InputChoiceGroup from '@components/InputChoiceGroup'

const Eligibility: NextPage = () => {
  const { t } = useTranslation('common')
  const [form, setForm] = useState({
    residential: '',
    pregnant: false,
    baby: false,
    child: false,
    guardian: false,
    none: false,
    loss: false,
    insurance: false,
    snap: false,
    tanf: false,
    none2: false,
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name }: { value: string; name: string } = e.target
    const castValue = value as keyof typeof form
    let newValue

    if (name === 'residential') {
      newValue = { [name]: value }
    } else {
      newValue = { [castValue]: !form[castValue] }
    }

    setForm({
      ...form,
      ...newValue,
    })
  }

  return (
    <form>
      <InputChoiceGroup
        title={t('Eligibility.residential')}
        type="radio"
        choices={[
          {
            checked: form.residential === 'yes',
            handleChange,
            label: 'Yes',
            name: 'residential',
            value: 'yes',
          },
          {
            checked: form.residential === 'no',
            handleChange,
            label: 'No',
            name: 'residential',
            value: 'no',
          },
        ]}
      />
      <br />
      <InputChoiceGroup
        title={t('Eligibility.categorical')}
        type="checkbox"
        choices={[
          {
            checked: form.pregnant,
            handleChange,
            label: t('Eligibility.pregnant'),
            value: 'pregnant',
          },
          {
            checked: form.baby,
            handleChange,
            label: t('Eligibility.baby'),
            value: 'baby',
          },
          {
            checked: form.child,
            handleChange,
            label: t('Eligibility.child'),
            value: 'child',
          },
          {
            checked: form.guardian,
            handleChange,
            label: t('Eligibility.guardian'),
            value: 'guardian',
          },
          {
            checked: form.none,
            handleChange,
            label: t('Eligibility.none'),
            value: 'none',
          },
          {
            checked: form.loss,
            handleChange,
            label: t('Eligibility.loss'),
            value: 'loss',
          },
        ]}
      />
      <br />
      <InputChoiceGroup
        title={t('Eligibility.programs')}
        type="checkbox"
        choices={[
          {
            checked: form.insurance,
            handleChange,
            label: t('Eligibility.insurance'),
            value: 'insurance',
          },
          {
            checked: form.snap,
            handleChange,
            label: t('Eligibility.snap'),
            value: 'snap',
          },
          {
            checked: form.tanf,
            handleChange,
            label: t('Eligibility.tanf'),
            value: 'tanf',
          },
          {
            checked: form.none2,
            handleChange,
            label: t('Eligibility.none'),
            value: 'none2',
          },
        ]}
      />
      <br />
      <br />
      <br />
      <ButtonLink href="/income" label={t('continue')} vector width="140px" />
    </form>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }
}

export default Eligibility

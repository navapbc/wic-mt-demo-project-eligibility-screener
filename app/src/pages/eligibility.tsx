import type { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { ChangeEvent, useEffect, useState } from 'react'

import ButtonLink from '@components/ButtonLink'
import InputChoiceGroup from '@components/InputChoiceGroup'

const Eligibility: NextPage = () => {
  const { t } = useTranslation('common')
  const incomeRoute = '/income'
  const [continueLink, setContinueLink] = useState(incomeRoute)
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

  useEffect(() => {
    if (form.none) {
      setContinueLink('/alternate')
    } else setContinueLink(incomeRoute)
  }, [form.none])

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
      <Link href="/information">Back</Link>
      <h1>{t('Eligibility.header')}</h1>
      <p>
        {t('asterisk')} (<abbr className="usa-hint usa-hint--required">*</abbr>
        ).
      </p>
      <InputChoiceGroup
        required
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
        accordion={{
          body: t('Eligibility.accordionBody'),
          header: t('Eligibility.accordionHeader'),
        }}
        required
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
            checked: form.loss,
            handleChange,
            label: t('Eligibility.loss'),
            value: 'loss',
          },
          {
            checked: form.none,
            handleChange,
            label: t('Eligibility.none'),
            value: 'none',
          },
        ]}
      />
      <br />
      <InputChoiceGroup
        required
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
      <ButtonLink href={continueLink} label={t('continue')} width="105px" />
      <br />
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

import { useAppContext } from '@context/state'
import type { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { ChangeEvent, useEffect, useState } from 'react'

import ButtonLink from '@components/ButtonLink'
import InputChoiceGroup from '@components/InputChoiceGroup'

interface Props {
  previousRoute: string
}

const Eligibility: NextPage<Props> = (props: Props) => {
  const { t } = useTranslation('common')
  const incomeRoute = '/income'
  const { session, setSession } = useAppContext()
  const [continueBtn, setContinueBtn] = useState({
    label: t('continue'),
    route: incomeRoute,
  })
  const [form, setForm] = useState(session && session.eligibility)

  useEffect(() => {
    /* NOTE: We are using useEffect() because we want to make sure the props provided by getServerSideProps() are reliably loaded into the page. */
    const prevRouteIndex = props.previousRoute.lastIndexOf('/')
    const previousRoute = props.previousRoute.substring(prevRouteIndex)
    if (form.none) {
      setContinueBtn({ ...continueBtn, route: '/alternate' })
    } else if (previousRoute === '/review') {
      setContinueBtn({
        label: t('updateAndReturn'),
        route: previousRoute,
      })
    } else setContinueBtn({ ...continueBtn, route: incomeRoute })
  }, [form.none, props.previousRoute])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name }: { value: string; name: string } = e.target
    const castValue = value as keyof typeof form
    let newValue

    if (name === 'residential') {
      newValue = { [name]: value }
    } else {
      newValue = { [castValue]: !form[castValue] }
    }

    const newForm = { ...form, ...newValue }

    setForm(newForm)
    setSession({ ...session, eligibility: newForm })
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
            checked: form.fdpir,
            handleChange,
            label: t('Eligibility.fdpir'),
            value: 'fdpir',
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
      <ButtonLink href={continueBtn.route} label={continueBtn.label} />
      <br />
    </form>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  return {
    props: {
      previousRoute: req.headers.referer,
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }
}

export default Eligibility

import { useAppContext } from '@context/state'
import type { GetServerSideProps, NextPage } from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ChangeEvent, useEffect, useState } from 'react'

import BackLink from '@components/BackLink'
import ButtonLink from '@components/ButtonLink'
import InputChoiceGroup from '@components/InputChoiceGroup'
import RequiredQuestionStatement from '@components/RequiredQuestionStatement'

interface Props {
  previousRoute: string
}

const Eligibility: NextPage<Props> = (props: Props) => {
  const incomeRoute = '/income'
  const { session, setSession } = useAppContext()
  const [continueBtn, setContinueBtn] = useState({
    labelKey: 'continue',
    route: incomeRoute,
  })
  const [form, setForm] = useState(session?.eligibility)
  const requiredMet = () => {
    const categorical = [
      'pregnant',
      'baby',
      'child',
      'guardian',
      'pregnant',
      'none',
    ].some((category) => form[category as keyof typeof form])
    const programs = ['insurance', 'snap', 'tanf', 'none2'].some(
      (program) => form[program as keyof typeof form]
    )

    return form.residential && categorical && form.before && programs
  }
  const [disabled, setDisabled] = useState<boolean>(!requiredMet())

  useEffect(() => {
    /* NOTE: We are using useEffect() because we want to make sure the props provided by getServerSideProps() are reliably loaded into the page. */
    const prevRouteIndex = props.previousRoute.lastIndexOf('/')
    const previousRoute = props.previousRoute.substring(prevRouteIndex)
    if (form.none) {
      setContinueBtn({ ...continueBtn, route: '/alternate' })
    } else if (previousRoute === '/review') {
      setContinueBtn({
        labelKey: 'updateAndReturn',
        route: previousRoute,
      })
    } else setContinueBtn({ ...continueBtn, route: incomeRoute })
  }, [form.none, props.previousRoute])

  useEffect(() => {
    setDisabled(!requiredMet())
  }, [form])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name }: { value: string; name: string } = e.target
    const castValue = value as keyof typeof form
    let newValue

    if (['residential', 'before'].includes(name)) {
      newValue = { [name]: value }
    } else {
      newValue = { [castValue]: !form[castValue] }
    }

    const newForm = { ...form, ...newValue }

    setForm(newForm)
    setSession({ ...session, eligibility: newForm })
  }

  return (
    <>
      <BackLink href="/information" />
      <h1>
        <Trans i18nKey="Eligibility.header" />
      </h1>
      <RequiredQuestionStatement />
      <form className="usa-form usa-form--large">
        <InputChoiceGroup
          required
          titleKey="Eligibility.residential"
          type="radio"
          choices={[
            {
              checked: form.residential === 'yes',
              handleChange,
              labelKey: 'Eligibility.yes',
              name: 'residential',
              value: 'yes',
            },
            {
              checked: form.residential === 'no',
              handleChange,
              labelKey: 'Eligibility.no',
              name: 'residential',
              value: 'no',
            },
          ]}
        />
        <InputChoiceGroup
          accordion={{
            bodyKey: 'Eligibility.accordionBody',
            headerKey: 'Eligibility.accordionHeader',
          }}
          required
          titleKey="Eligibility.categorical"
          type="checkbox"
          choices={[
            {
              checked: form.pregnant,
              handleChange,
              labelKey: 'Eligibility.pregnant',
              value: 'pregnant',
            },
            {
              checked: form.baby,
              handleChange,
              labelKey: 'Eligibility.baby',
              value: 'baby',
            },
            {
              checked: form.child,
              handleChange,
              labelKey: 'Eligibility.child',
              value: 'child',
            },
            {
              checked: form.guardian,
              handleChange,
              labelKey: 'Eligibility.guardian',
              value: 'guardian',
            },
            {
              checked: form.loss,
              handleChange,
              labelKey: 'Eligibility.loss',
              value: 'loss',
            },
            {
              checked: form.none,
              handleChange,
              labelKey: 'Eligibility.none',
              value: 'none',
            },
          ]}
        />
        <InputChoiceGroup
          required
          titleKey="Eligibility.before"
          type="radio"
          choices={[
            {
              checked: form.before === 'yes2',
              handleChange,
              labelKey: 'Eligibility.yes',
              name: 'before',
              value: 'yes2' /* TODO: refactor */,
            },
            {
              checked: form.before === 'no2',
              handleChange,
              labelKey: 'Eligibility.no',
              name: 'before',
              value: 'no2',
            },
          ]}
        />
        <InputChoiceGroup
          required
          titleKey="Eligibility.programs"
          type="checkbox"
          choices={[
            {
              checked: form.insurance,
              handleChange,
              labelKey: 'Eligibility.insurance',
              value: 'insurance',
            },
            {
              checked: form.snap,
              handleChange,
              labelKey: 'Eligibility.snap',
              value: 'snap',
            },
            {
              checked: form.tanf,
              handleChange,
              labelKey: 'Eligibility.tanf',
              value: 'tanf',
            },
            {
              checked: form.fdpir,
              handleChange,
              labelKey: 'Eligibility.fdpir',
              value: 'fdpir',
            },
            {
              checked: form.none2,
              handleChange,
              labelKey: 'Eligibility.none',
              value: 'none2',
            },
          ]}
        />
        <ButtonLink
          href={continueBtn.route}
          labelKey={continueBtn.labelKey}
          disabled={disabled}
        />
      </form>
    </>
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

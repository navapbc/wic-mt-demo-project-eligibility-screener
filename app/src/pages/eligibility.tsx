import { useAppContext } from '@context/state'
import type { GetServerSideProps, NextPage } from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import set from 'lodash/set'
import { ChangeEvent, useEffect, useState } from 'react'

import BackLink from '@components/BackLink'
import ButtonLink from '@components/ButtonLink'
import InputChoiceGroup from '@components/InputChoiceGroup'
import RequiredQuestionStatement from '@components/RequiredQuestionStatement'
import getNestedValue from '../utils/getNestedValue'

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
    const categorical = Object.values(form.categorical).includes(true)
    const programs = Object.values(form.programs).includes(true)

    return form.residential && categorical && form.before && programs
  }
  const [disabled, setDisabled] = useState<boolean>(!requiredMet())

  useEffect(() => {
    /* NOTE: We are using useEffect() because we want to make sure the props provided by getServerSideProps() are reliably loaded into the page. */
    const prevRouteIndex = props.previousRoute.lastIndexOf('/')
    const previousRoute = props.previousRoute.substring(prevRouteIndex)
    if (form.categorical.none) {
      setContinueBtn({ ...continueBtn, route: '/alternate' })
    } else if (previousRoute === '/review') {
      setContinueBtn({
        labelKey: 'updateAndReturn',
        route: previousRoute,
      })
    } else setContinueBtn({ ...continueBtn, route: incomeRoute })
  }, [form.categorical.none, props.previousRoute])

  useEffect(() => {
    setDisabled(!requiredMet())
  }, [requiredMet()])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name }: { value: string; name: string } = e.target
    let newForm: typeof form = form
    
    if (['residential', 'before'].includes(name)) {
      set(newForm, name, value) 
    } else {
      const castValue = value as keyof typeof form
      // toggles deeply nested boolean of either categorical or program value
      set(newForm, castValue, !getNestedValue(form, castValue))
      const categoricalOrProgram: 'categorical' | 'programs' = castValue.split('.')[0] as 'categorical' | 'programs'
      const nestedNoneKey = `${categoricalOrProgram}.none`
      // If none of the above was just set to true, deselect all other options
      if (castValue.includes('none') && getNestedValue(newForm, nestedNoneKey)) {
        Object.keys(form[categoricalOrProgram]).forEach(key => {
          if (key !== 'none') {
            const nestedKey = `${categoricalOrProgram}.${key}`
            set(newForm, nestedKey, false)
          }
        })
      } else if (getNestedValue(form, nestedNoneKey)) {
        // if none of the above had been previously selected for current question, deselect it
        set(newForm, nestedNoneKey, false)
      }
    }

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
              checked: form.categorical?.pregnant,
              handleChange,
              labelKey: 'Eligibility.pregnant',
              value: 'categorical.pregnant',
            },
            {
              checked: form.categorical?.baby,
              handleChange,
              labelKey: 'Eligibility.baby',
              value: 'categorical.baby',
            },
            {
              checked: form.categorical?.child,
              handleChange,
              labelKey: 'Eligibility.child',
              value: 'categorical.child',
            },
            {
              checked: form.categorical?.guardian,
              handleChange,
              labelKey: 'Eligibility.guardian',
              value: 'categorical.guardian',
            },
            {
              checked: form.categorical?.loss,
              handleChange,
              labelKey: 'Eligibility.loss',
              value: 'categorical.loss',
            },
            {
              checked: form.categorical?.none,
              handleChange,
              labelKey: 'Eligibility.none',
              value: 'categorical.none',
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
              checked: form.programs?.insurance,
              handleChange,
              labelKey: 'Eligibility.insurance',
              value: 'programs.insurance',
            },
            {
              checked: form.programs?.snap,
              handleChange,
              labelKey: 'Eligibility.snap',
              value: 'programs.snap',
            },
            {
              checked: form.programs?.tanf,
              handleChange,
              labelKey: 'Eligibility.tanf',
              value: 'programs.tanf',
            },
            {
              checked: form.programs?.fdpir,
              handleChange,
              labelKey: 'Eligibility.fdpir',
              value: 'programs.fdpir',
            },
            {
              checked: form.programs?.none,
              handleChange,
              labelKey: 'Eligibility.none',
              value: 'programs.none',
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

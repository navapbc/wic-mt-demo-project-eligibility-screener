import { useAppContext } from '@context/state'
import { useTranslation } from 'next-i18next'
import { ReactElement } from 'react'

import Table from '@components/Table'

type Category = 'pregnant' | 'baby' | 'child' | 'guardian' | 'loss'

type Program = 'insurance' | 'snap' | 'tanf'

interface Props {
  editable?: boolean
}

const OverviewTables = (props: Props): ReactElement => {
  const { t } = useTranslation('common')
  const { session } = useAppContext()
  const { editable } = props
  const categoryKeys: Category[] = [
    'pregnant',
    'baby',
    'child',
    'guardian',
    'loss',
  ]
  const programKeys: Program[] = ['insurance', 'snap', 'tanf']

  const formatClinic = (): string => {
    const clinic = session?.clinic

    return `
      ${clinic?.clinic || ''}
      <br />
      ${clinic?.clinicAddress || ''}
      <br />
      ${clinic?.clinicTelephone || ''}
    `
  }

  const formatEligibilitySelections = (
    keys: (Category | Program)[]
  ): string => {
    let returnVal = ''

    keys.forEach((key: Category | Program) => {
      if (session.eligibility[key]) {
        returnVal = returnVal.concat(t(`Eligibility.${key}`), '<br /> ')
      }
    })

    return returnVal
  }

  return (
    <>
      <Table
        editable={editable}
        editLink="eligibility"
        title={t('Review.eligibilityTitle')}
        rows={[
          {
            header: t('Eligibility.residential'),
            body: session?.eligibility?.residential || '',
          },
          {
            header: t('Eligibility.categorical'),
            body: formatEligibilitySelections(categoryKeys),
          },
          {
            header: t('Eligibility.before'),
            body: session?.eligibility?.before.replace(/[2]/g, '') || '',
          },
          {
            header: t('Eligibility.programs'),
            body: formatEligibilitySelections(programKeys),
          },
        ]}
      />
      <Table
        editable={editable}
        editLink="/clinic"
        title={t('Clinic.title')}
        rows={[
          {
            header: t('Review.clinicSelected'),
            body: (session?.clinic && formatClinic()) || '',
          },
        ]}
      />
      <Table
        editable={editable}
        editLink="/contact"
        title={t('Contact.title')}
        rows={[
          {
            header: t('Contact.firstName'),
            body: session?.contact.firstName || '',
          },
          {
            header: t('Contact.lastName'),
            body: session?.contact.lastName || '',
          },
          {
            header: t('Contact.phoneLabel'),
            body: session?.contact.phone || '',
          },
          {
            header: t('Contact.otherLabel'),
            body: session?.contact.other || '',
          },
        ]}
      />
    </>
  )
}

export default OverviewTables
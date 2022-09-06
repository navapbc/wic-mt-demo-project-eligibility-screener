import { useTranslation } from 'next-i18next'
import { ReactElement } from 'react'

import Table from '@components/Table'

interface Props {
  editable?: boolean
}

const OverviewTables = (props: Props): ReactElement => {
  const { t } = useTranslation('common')
  const { editable } = props

  return (
    <>
      <Table
        editable={editable}
        title={t('Review.eligibilityTitle')}
        rows={[
          {
            header: t('Eligibility.residential'),
            body: 'answer',
          },
          {
            header: t('Eligibility.categorical'),
            body: 'string',
          },
          {
            header: t('Eligibility.programs'),
            body: 'string',
          },
        ]}
      />
      <Table
        editable={editable}
        title={t('Clinic.title')}
        rows={[
          {
            header: t('Review.clinicSelected'),
            body: 'answer',
          },
        ]}
      />
      <Table
        editable={editable}
        title={t('Contact.title')}
        rows={[
          {
            header: t('Contact.firstName'),
            body: 'answer',
          },
          {
            header: t('Contact.lastName'),
            body: 'answer',
          },
          {
            header: t('Contact.phoneLabel'),
            body: 'answer',
          },
          {
            header: t('Contact.otherLabel'),
            body: 'answer',
          },
        ]}
      />
    </>
  )
}

export default OverviewTables

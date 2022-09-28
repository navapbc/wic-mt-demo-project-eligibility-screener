import { getCookie } from 'cookies-next'
import type { GetServerSideProps, NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import ButtonLink from '@components/ButtonLink'
import OverviewTables from '@components/OverviewTables'
import StyledLink from '@components/StyledLink'

import { DefaultState } from '../context/state'

const Summary: NextPage = () => {
  const { t } = useTranslation('common')

  return (
    <>
      <h1>
        <Trans i18nKey="Summary.title" />
      </h1>
      <p>
        <Trans i18nKey="Summary.body" />
      </p>
      <p>
        <Trans i18nKey="Summary.interestedIn" />
        <div>
          <StyledLink
            href="https://dphhs.mt.gov/Assistance"
            text={t('Summary.learnAbout')}
            external={true}
          />
        </div>
      </p>
      <p>
        <Trans i18nKey="Summary.submitAnother" />
        <ButtonLink label={t('Summary.startNew')} href="/" style="outline" />
      </p>
      <p>
        <Trans i18nKey="Summary.keepCopy" />
      </p>
      <OverviewTables />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const sessionCookie: string = getCookie('session', { req, res }) as string
  const session: DefaultState = JSON.parse(sessionCookie) as DefaultState
  const householdSize = session?.householdSize

  const request = await fetch(
    `${process?.env?.NEXT_PUBLIC_HOST || ''}/v1/eligibility-screener`,
    {
      method: 'POST',
      body: JSON.stringify({
        first_name: session?.contact.firstName,
        last_name: session?.contact.lastName,
        phone_number: session?.contact.phone,
        eligibility_categoies: session?.csv?.category_copy_array,
        has_prior_wic_enrollment:
          session?.eligibility?.before.replace(/[2]/g, '') === 'yes',
        eligibility_programs: session?.csv?.program_copy_array,
        household_size: householdSize && parseInt(householdSize),
        zip_code: '11111',
        wic_clinic: session?.clinic?.clinic,
        applicant_notes: session?.contact.other,
      }),
      headers: {
        'Content-type': 'application/json',
        'X-Auth': process.env.NEXT_PUBLIC_API_AUTH_TOKEN || '',
      },
    }
  )
  const apiResponse: object = (await request.json()) as object
  console.log('RESPONSE', apiResponse)

  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }
}

export default Summary

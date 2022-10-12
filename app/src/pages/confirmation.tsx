import type { SessionProp } from '@customTypes/common'
import type { GetServerSideProps, NextPage } from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import ButtonLink from '@components/ButtonLink'
import ReviewCollection from '@components/ReviewCollection'
import StyledLink from '@components/StyledLink'

import {
  formatClinicResponses,
  formatContactResponses,
  formatEligibilityResponses,
} from '@pages/review'

const Confirmation: NextPage<SessionProp> = (props: SessionProp) => {
  const { session } = props

  return (
    <>
      <h1>
        <Trans i18nKey="Confirmation.title" />
      </h1>
      <p>
        <Trans i18nKey="Confirmation.body" />
      </p>
      <div className="content-group-small">
        <h2 className="font-sans-xs">
          <Trans i18nKey="Confirmation.interestedIn" />
        </h2>
        <p>
          <StyledLink
            href="https://dphhs.mt.gov/Assistance"
            textKey="Confirmation.learnAbout"
            external={true}
          />
        </p>
      </div>
      <div className="content-group-small">
        <h2 className="font-sans-xs">
          <Trans i18nKey="Confirmation.submitAnother" />
        </h2>
        <ButtonLink labelKey="Confirmation.startNew" href="/" style="outline" />
      </div>
      <div className="content-group-small">
        <h2 className="font-sans-xs">
          <Trans i18nKey="Confirmation.keepCopy" />
        </h2>
      </div>
      <ReviewCollection
        headerKey="Review.eligibilityTitle"
        editable={false}
        editHref="/eligibility"
        reviewElements={formatEligibilityResponses(session)}
        firstElement={true}
      />
      <ReviewCollection
        headerKey="ChooseClinic.title"
        editable={false}
        editHref="/choose-clinic"
        reviewElements={formatClinicResponses(session)}
      />
      <ReviewCollection
        headerKey="Contact.title"
        editable={false}
        editHref="/contact"
        reviewElements={formatContactResponses(session)}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }
}

export default Confirmation

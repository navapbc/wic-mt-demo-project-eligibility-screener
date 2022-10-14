import { useAppContext } from '@context/state'
import type {
  GetServerSideProps,
  GetServerSidePropsResult,
  NextPage,
} from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ChangeEventHandler, useEffect, useState } from 'react'
import NumberFormat from 'react-number-format'

import Alert from '@components/Alert'
import BackLink from '@components/BackLink'
import ButtonLink from '@components/ButtonLink'
import Required from '@components/Required'
import RequiredQuestionStatement from '@components/RequiredQuestionStatement'
import TextArea from '@components/TextArea'
import TextInput from '@components/TextInput'

interface Props {
  previousRoute: string
}

const Contact: NextPage<Props> = (props: Props) => {
  const { session, setSession } = useAppContext()
  const [form, setForm] = useState(session?.contact)

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value, id }: { value: string; id: string } = e.target
    console.log(`handleChange: ${value}`)
    const castId = id as keyof typeof form
    const newForm = { ...form, [castId]: value }

    setForm(newForm)
    setSession({ ...session, contact: newForm })
  }

  return (
    <TextInput
      handleChange={handleChange}
      id="firstName"
      labelKey="Contact.firstName"
      required
      value={form.firstName}
    />
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  // const prevRouteIndex = req.headers.referer?.lastIndexOf('/')
  // const previousRoute =
  //   prevRouteIndex && req.headers.referer?.substring(prevRouteIndex)
  // let returnval: GetServerSidePropsResult<{ [key: string]: object | string }> =
  //   {
  //     props: {
  //       previousRoute: previousRoute as string,
  //       ...(await serverSideTranslations(locale || 'en', ['common'])),
  //     },
  //   }

  // if (!['/choose-clinic', '/review'].includes(previousRoute as string)) {
  //   returnval = {
  //     ...returnval,
  //     redirect: {
  //       destination: previousRoute || '/',
  //       permanent: false,
  //     },
  //   }
  // }

  // return returnval
  return {
    props: {
      previousRoute: '/choose-clinic',
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }
}

export default Contact

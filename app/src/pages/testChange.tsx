import type { ContactData, ModifySessionProps } from '@customTypes/common'
import type { GetServerSideProps, NextPage } from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { ChangeEventHandler, useEffect, useState } from 'react'
import NumberFormat from 'react-number-format'

import Alert from '@components/Alert'
import BackLink from '@components/BackLink'
import ButtonLink from '@components/ButtonLink'
import RequiredQuestionStatement from '@components/RequiredQuestionStatement'
import TextArea from '@components/TextArea'
import TextInput from '@components/TextInput'

const Blah: NextPage<ModifySessionProps> = (props: ModifySessionProps) => {
  // Get the session from props.
  const { session, setSession } = props
  // Initialize form as a state using the value in session.
  const initialContactData = {
    firstName: 'hello?',
    lastName: '',
    phone: '',
    comments: '',
  }
  const pretendSessionData = {
    firstName: 'hello?',
    lastName: '',
    phone: '',
    comments: '',
  }
  const [form, setForm] = useState<ContactData>(session.contact)
  // Use useEffect() to properly load the data from session storage during react hydration.
  // useEffect(() => {
  //   setForm(form.contact)
  // }, [form.contact])

  const myChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name, type }: { value: string; name: string; type: string } =
      e.target
    console.log(`myChange: ${value}`)
    const newForm = { ...form, [name]: value }
    setForm(newForm)
    setSession({ ...session, contact: newForm })
  }

  return (
    <input
      className="usa-input"
      id="firstName"
      name="firstName"
      onInput={myChange}
      role="textbox"
      value={form.firstName}
    />
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }
}

export default Blah

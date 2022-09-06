import Link from 'next/link'
import { ReactElement } from 'react'
import styled from 'styled-components'

interface Props {
  editable?: boolean
  editLink?: string
  rows: {
    header: string
    body: string
  }[]
  title: string
}

const Table = (props: Props): ReactElement => {
  const { editable, editLink, rows, title } = props

  return (
    <div className="width-mobile">
      <StyledTable className="usa-table usa-table--stacked usa-table--borderless">
        <Title>
          <span>{title}</span>
          {editable && editLink && (
            <Link href={editLink}>
              <button className="usa-button usa-button--secondary usa-button--unstyled">
                Edit
              </button>
            </Link>
          )}
        </Title>
        <thead></thead>
        <tbody>
          <tr>
            {rows.map((row, i) => (
              <td
                data-label={row.header}
                key={i}
                dangerouslySetInnerHTML={{ __html: row.body }}
              />
            ))}
          </tr>
        </tbody>
      </StyledTable>
    </div>
  )
}

const StyledTable = styled.table`
  margin-top: 3em;
  min-width: 21em;
`

const Title = styled.caption`
  gap: 6rem;
  display: inline-flex !important;
  font-size: 1.5em !important;
  button {
    float: right;
  }
  span {
    width: 15rem;
  }
`

export default Table

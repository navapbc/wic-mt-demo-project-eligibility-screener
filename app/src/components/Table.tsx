import Link from 'next/link'
import { ReactElement } from 'react'

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
      <table className="usa-table usa-table--stacked usa-table--borderless">
        <h2>{title}</h2>
        {editable && editLink && (
          <Link href={editLink}>
            <button className="usa-button usa-button--secondary usa-button--unstyled">
              Edit
            </button>
          </Link>
        )}
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
      </table>
    </div>
  )
}

export default Table

import type { TDocumentDefinitions } from 'pdfmake/interfaces'

import { invoiceData } from './data'

type InvoiceData = typeof invoiceData

const BRAND_COLOR = '#09afdf'
const TEXT_COLOR = '#2a2a2a'
const MUTED_COLOR = '#666666'
const BORDER_COLOR = '#e5e5e5'

let pdfMakePromise: Promise<typeof import('pdfmake/build/pdfmake').default> | null = null

async function loadPdfMake() {
  if (!pdfMakePromise) {
    pdfMakePromise = (async () => {
      const [{ default: pdfMake }, fontsModule] = await Promise.all([
        import('pdfmake/build/pdfmake'),
        import('pdfmake/build/vfs_fonts'),
      ])

      // pdfmake's vfs_fonts ships as a CommonJS module that does
      // `module.exports = vfs` where `vfs` is the dictionary of base64-encoded
      // fonts keyed by file name. Across versions/bundlers it can surface in a
      // few shapes, so probe the most common ones.
      const fontsAny = fontsModule as unknown as {
        default?: Record<string, string> | { vfs?: Record<string, string>; pdfMake?: { vfs?: Record<string, string> } }
        vfs?: Record<string, string>
        pdfMake?: { vfs?: Record<string, string> }
      }
      const fontsDefault = fontsAny.default
      const isFontDictionary = (value: unknown): value is Record<string, string> =>
        typeof value === 'object' && value !== null && Object.values(value).every((entry) => typeof entry === 'string')

      const vfs =
        fontsAny.vfs ??
        fontsAny.pdfMake?.vfs ??
        (fontsDefault && typeof fontsDefault === 'object' && 'vfs' in fontsDefault ? fontsDefault.vfs : undefined) ??
        (fontsDefault &&
        typeof fontsDefault === 'object' &&
        'pdfMake' in fontsDefault &&
        fontsDefault.pdfMake &&
        typeof fontsDefault.pdfMake === 'object'
          ? fontsDefault.pdfMake.vfs
          : undefined) ??
        (isFontDictionary(fontsDefault) ? fontsDefault : undefined)

      if (vfs) {
        ;(pdfMake as unknown as { vfs: Record<string, string> }).vfs = vfs
      }

      return pdfMake
    })()
  }

  return pdfMakePromise
}

function buildDocDefinition(data: InvoiceData): TDocumentDefinitions {
  const lineItemRows = data.lineItems.map((item) => [
    {
      stack: [
        { text: item.category, color: BRAND_COLOR, bold: true },
        { text: item.description, fontSize: 9, color: MUTED_COLOR, margin: [0, 2, 0, 0] },
      ],
    },
    { text: `$${item.rate}`, alignment: 'left' },
    { text: item.hours, alignment: 'left' },
    { text: `$${item.total}`, alignment: 'left' },
  ])

  const totalsRows: Array<Array<Record<string, unknown>>> = [
    [
      { text: 'Total Paid', colSpan: 3, alignment: 'right', bold: true, color: '#555555' },
      {},
      {},
      { text: `$${data.totalPaid}` },
    ],
    [
      { text: 'Late Fees', colSpan: 3, alignment: 'right', bold: true, color: '#555555' },
      {},
      {},
      { text: '$0.00' },
    ],
    [
      { text: 'Remaining Balance', colSpan: 3, alignment: 'right', bold: true, color: '#555555' },
      {},
      {},
      { text: `$${data.totalUnpaid}` },
    ],
    [
      { text: 'Invoice Total', colSpan: 3, alignment: 'right', bold: true, color: '#333333' },
      {},
      {},
      { text: `$${data.total}`, bold: true, color: '#333333' },
    ],
  ]

  return {
    info: {
      title: `Invoice ${data.identifier}`,
      author: 'CodeBuilder Inc.',
      subject: `Invoice #${data.identifier}`,
    },
    pageSize: 'LETTER',
    pageMargins: [48, 48, 48, 64],
    defaultStyle: {
      fontSize: 10,
      color: TEXT_COLOR,
      lineHeight: 1.35,
    },
    styles: {
      title: { fontSize: 22, color: TEXT_COLOR, bold: false },
      sectionHeading: { fontSize: 12, color: '#444444', bold: true },
      tableHeader: { bold: true, color: '#555555', fillColor: '#fafafa' },
      muted: { color: MUTED_COLOR, fontSize: 10 },
    },
    content: [
      {
        columns: [
          { text: 'Client Invoice', style: 'title' },
          {
            stack: [
              { text: `Invoice #${data.identifier}`, alignment: 'right', bold: true },
              { text: `Created At: ${data.createdAt}`, alignment: 'right', style: 'muted' },
              { text: `Due Date: ${data.dueDate}`, alignment: 'right', style: 'muted' },
            ],
          },
        ],
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 12, x2: 515, y2: 12, lineWidth: 0.5, lineColor: BORDER_COLOR }],
        margin: [0, 0, 0, 12],
      },
      {
        columns: [
          {
            stack: [
              { text: 'CodeBuilder Inc.', bold: true },
              { text: '1211 22nd Ave NE', style: 'muted' },
              { text: 'Minneapolis, MN 55418', style: 'muted' },
              { text: 'P: (612) 567-2633', style: 'muted' },
              { text: 'E-mail: info@codebuilder.us', style: 'muted', color: BRAND_COLOR },
            ],
          },
          {
            stack: [
              { text: 'Bill To', style: 'sectionHeading', alignment: 'right', margin: [0, 0, 0, 4] },
              { text: data.client.name, alignment: 'right' },
              { text: data.client.firm, alignment: 'right', style: 'muted' },
              ...data.client.address.split('\n').map((line) => ({
                text: line,
                alignment: 'right' as const,
                style: 'muted',
              })),
            ],
          },
        ],
        margin: [0, 0, 0, 16],
      },
      {
        text: 'Comments: N/A.',
        style: 'muted',
        margin: [0, 0, 0, 12],
      },
      {
        table: {
          headerRows: 1,
          widths: ['*', 70, 50, 70],
          body: [
            [
              { text: 'Description', style: 'tableHeader' },
              { text: 'Price', style: 'tableHeader' },
              { text: 'Hours', style: 'tableHeader' },
              { text: 'Total', style: 'tableHeader' },
            ],
            ...lineItemRows,
            ...totalsRows,
          ],
        },
        layout: {
          hLineColor: () => BORDER_COLOR,
          vLineColor: () => BORDER_COLOR,
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          paddingTop: () => 8,
          paddingBottom: () => 8,
          paddingLeft: () => 8,
          paddingRight: () => 8,
        },
        margin: [0, 0, 0, 16],
      },
      {
        text: [
          'If you have any questions concerning this invoice, please contact ',
          { text: 'CodeBuilder, Inc.', bold: true },
          ', tel: ',
          { text: '+1 (612) 567-2633', bold: true },
          ', email: ',
          { text: 'info@codebuilder.us', bold: true },
        ],
        style: 'muted',
        margin: [0, 8, 0, 0],
      },
    ],
    footer: (currentPage, pageCount) => ({
      columns: [
        { text: `Invoice #${data.identifier}`, alignment: 'left', style: 'muted', margin: [48, 0, 0, 0] },
        {
          text: `Page ${currentPage} of ${pageCount}`,
          alignment: 'right',
          style: 'muted',
          margin: [0, 0, 48, 0],
        },
      ],
      margin: [0, 16, 0, 0],
    }),
  }
}

async function buildPdf(data: InvoiceData) {
  const pdfMake = await loadPdfMake()
  return pdfMake.createPdf(buildDocDefinition(data))
}

export async function downloadInvoicePdf(data: InvoiceData = invoiceData) {
  const pdf = await buildPdf(data)
  pdf.download(`invoice-${data.identifier}.pdf`)
}

export async function printInvoicePdf(data: InvoiceData = invoiceData) {
  const pdf = await buildPdf(data)
  pdf.print()
}

export async function openInvoicePdf(data: InvoiceData = invoiceData) {
  const pdf = await buildPdf(data)
  pdf.open()
}

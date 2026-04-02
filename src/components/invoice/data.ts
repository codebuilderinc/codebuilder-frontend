export const invoiceData = {
  identifier: 'CB-2024-117',
  createdAt: 'Nov 03, 2024',
  dueDate: 'Nov 03, 2024',
  client: {
    name: 'ACME Product Team',
    firm: 'ACME Labs LLC',
    address: '47 River Road\nAustin, TX 78701',
  },
  totalPaid: '1,500.00',
  totalUnpaid: '2,680.00',
  total: '4,180.00',
  lineItems: [
    {
      category: 'Application Engineering',
      description: 'Responsive front-end architecture, UI refinement, deployment prep',
      rate: '110.00',
      hours: '16',
      total: '1,760.00',
    },
    {
      category: 'API Integration',
      description: 'Payment, CRM, and workflow automation integration support',
      rate: '120.00',
      hours: '11',
      total: '1,320.00',
    },
    {
      category: 'Consulting / Planning',
      description: 'Architecture review, backlog planning, and implementation guidance',
      rate: '110.00',
      hours: '10',
      total: '1,100.00',
    },
  ],
}

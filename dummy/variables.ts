
export interface VariableOption {
  text: string;
  value: string;
}

export const dummyVariables: VariableOption[] = [
  { text: 'First Name', value: '{{firstName}}' },
  { text: 'Last Name', value: '{{lastName}}' },
  { text: 'Full Name', value: '{{fullName}}' },
  { text: 'Email Address', value: '{{email}}' },
  { text: 'Company Name', value: '{{companyName}}' },
  { text: 'Job Title', value: '{{jobTitle}}' },
  { text: 'Phone Number', value: '{{phoneNumber}}' },
  { text: 'City', value: '{{city}}' },
  { text: 'State', value: '{{state}}' },
  { text: 'Country', value: '{{country}}' },
  { text: 'Current Date', value: '{{currentDate}}' },
  { text: 'Current Time', value: '{{currentTime}}' },
  { text: 'Product Name', value: '{{productName}}' },
  { text: 'Order Number', value: '{{orderNumber}}' },
  { text: 'Invoice Number', value: '{{invoiceNumber}}' },
  { text: 'Website URL', value: '{{websiteUrl}}' },
  { text: 'Discount Code', value: '{{discountCode}}' },
  { text: 'Expiry Date', value: '{{expiryDate}}' },
  { text: 'Support Email', value: '{{supportEmail}}' },
  { text: 'Unsubscribe Link', value: '{{unsubscribeLink}}' }
];

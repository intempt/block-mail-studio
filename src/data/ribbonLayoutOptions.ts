
export interface RibbonLayoutOption {
  id: string;
  name: string;
  columns: number;
  ratio: string;
  preview: string[];
}

export const ribbonLayoutOptions: RibbonLayoutOption[] = [
  { id: '1-column', name: '1 Col', columns: 1, ratio: '100', preview: ['100%'] },
  { id: '2-column-50-50', name: '50/50', columns: 2, ratio: '50-50', preview: ['50%', '50%'] },
  { id: '2-column-33-67', name: '33/67', columns: 2, ratio: '33-67', preview: ['33%', '67%'] },
  { id: '2-column-67-33', name: '67/33', columns: 2, ratio: '67-33', preview: ['67%', '33%'] },
  { id: '2-column-25-75', name: '25/75', columns: 2, ratio: '25-75', preview: ['25%', '75%'] },
  { id: '2-column-75-25', name: '75/25', columns: 2, ratio: '75-25', preview: ['75%', '25%'] },
  { id: '3-column-equal', name: '33/33/33', columns: 3, ratio: '33-33-33', preview: ['33%', '33%', '33%'] },
  { id: '3-column-25-50-25', name: '25/50/25', columns: 3, ratio: '25-50-25', preview: ['25%', '50%', '25%'] },
  { id: '3-column-25-25-50', name: '25/25/50', columns: 3, ratio: '25-25-50', preview: ['25%', '25%', '50%'] },
  { id: '3-column-50-25-25', name: '50/25/25', columns: 3, ratio: '50-25-25', preview: ['50%', '25%', '25%'] }
];

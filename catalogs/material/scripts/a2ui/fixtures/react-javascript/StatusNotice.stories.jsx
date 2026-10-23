import { StatusNotice } from './StatusNotice.jsx';

export default {
  title: 'JavaScript/StatusNotice',
  component: StatusNotice,
  tags: ['autodocs'],
};
// Deliberately different from source defaults.
export const Warning = { args: { label: 'Pending', tone: 'warning', count: 7, compact: true } };
export const Success = { args: { label: 'Complete', tone: 'success', count: 12 } };

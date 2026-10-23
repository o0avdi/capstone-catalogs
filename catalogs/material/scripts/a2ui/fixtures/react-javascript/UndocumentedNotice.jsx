import React from 'react';

/** JavaScript without PropTypes: defaults alone do not establish a full contract. */
export function UndocumentedNotice({ label, count = 0 }) {
  return <aside>{label}: {count}</aside>;
}

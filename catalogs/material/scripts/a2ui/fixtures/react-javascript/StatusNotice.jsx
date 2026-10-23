import React from 'react';
import PropTypes from 'prop-types';

/** A JavaScript-only status summary with a documented source contract. */
export function StatusNotice({ label, tone = 'info', count = 0, compact = false }) {
  return <aside data-tone={tone} data-compact={compact}>{label}: {count}</aside>;
}

StatusNotice.propTypes = {
  /** Accessible summary label supplied by the caller. */
  label: PropTypes.string.isRequired,
  /** Visual emphasis of the status. */
  tone: PropTypes.oneOf(['info', 'success', 'warning']),
  /** Number of items represented by the summary. */
  count: PropTypes.number,
  /** Whether to use compact spacing. */
  compact: PropTypes.bool,
};

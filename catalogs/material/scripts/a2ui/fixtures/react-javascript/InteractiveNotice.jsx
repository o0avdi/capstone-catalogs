import React from 'react';
import PropTypes from 'prop-types';

/** Source behavior that needs explicit reviewed A2UI mappings. */
export function InteractiveNotice({ label, onDismiss, children, options }) {
  return <section data-mode={options?.mode}><button onClick={onDismiss}>{label}</button>{children}</section>;
}
InteractiveNotice.propTypes = {
  label: PropTypes.string.isRequired,
  /** Called when the dismissal button is clicked. */
  onDismiss: PropTypes.func,
  /** Projected detail content. */
  children: PropTypes.node,
  /** Behavior configuration. */
  options: PropTypes.shape({ mode: PropTypes.string }),
};

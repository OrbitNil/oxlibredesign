import type { MantineTheme } from '@mantine/core';

/** Match list/context menus: dark panel, white hairline, no bright primary focus ring */
const stroke = 'rgba(255, 255, 255, 0.1)';
const strokeInput = 'rgba(255, 255, 255, 0.12)';

export function getDialogModalStyles(theme: MantineTheme) {
  return {
    modal: {
      backgroundColor: 'rgba(8, 8, 8, 0.96)',
      border: `1px solid ${stroke}`,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
    },
    header: {
      marginBottom: 0,
      paddingBottom: theme.spacing.sm,
      borderBottom: 'none',
    },
    title: {
      textAlign: 'center' as const,
      width: '100%',
      fontSize: 15,
      fontWeight: 600,
      color: 'rgba(255, 255, 255, 0.98)',
    },
    body: {
      paddingTop: theme.spacing.sm,
    },
  };
}

export const dialogCancelButtonStyles = {
  root: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    border: `1px solid ${strokeInput}`,
    color: 'rgba(255, 255, 255, 0.92)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:disabled': {
      opacity: 0.45,
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
    },
  },
};

export const dialogConfirmButtonStyles = {
  root: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#111',
    border: 'none',
    '&:hover': {
      backgroundColor: '#ffffff',
    },
  },
};

/** TextInput, PasswordInput, Textarea, NumberInput, TimeInput, DatePicker input, ColorInput */
export const dialogFieldStyles = {
  label: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontWeight: 600,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.42)',
  },
  required: {
    color: 'rgba(248, 113, 113, 0.95)',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.45)',
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    border: `1px solid ${strokeInput}`,
    color: 'rgba(255, 255, 255, 0.95)',
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.35)',
    },
    '&:focus, &:focus-within': {
      borderColor: 'rgba(255, 255, 255, 0.45)',
      boxShadow: 'none',
    },
  },
};

export const dialogSelectStyles = {
  ...dialogFieldStyles,
  dropdown: {
    backgroundColor: 'rgba(12, 12, 12, 0.98)',
    border: `1px solid ${strokeInput}`,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
  },
  item: {
    color: 'rgba(255, 255, 255, 0.92)',
    '&[data-hovered]': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    '&[data-selected]': {
      backgroundColor: 'rgba(255, 255, 255, 0.14)',
    },
  },
  values: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
};

export const dialogSliderStyles = {
  bar: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  track: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  thumb: {
    border: '2px solid rgba(255, 255, 255, 0.9)',
    backgroundColor: '#fff',
    boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.25)',
  },
};

export const dialogCheckboxStyles = {
  label: {
    color: 'rgba(255, 255, 255, 0.88)',
  },
};

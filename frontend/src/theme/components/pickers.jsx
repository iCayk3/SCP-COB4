import { pickersOutlinedInputClasses } from '@mui/x-date-pickers';

// MUI ICON COMPONENTS
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';

// ==============================================================
// DATE PICKER
// ==============================================================
export const DatePicker = () => ({
  defaultProps: {
    slots: {
      openPickerIcon: CalendarMonthOutlined,
      switchViewIcon: props => <KeyboardArrowDown {...props} fontSize="small" />,
      leftArrowIcon: props => <KeyboardArrowLeft {...props} fontSize="small" />,
      rightArrowIcon: props => <KeyboardArrowRight {...props} fontSize="small" />
    }
  }
});
export const DatePickersOutlinedInput = theme => ({
  styleOverrides: {
    input: {
      color: theme.palette.text.primary
    },
    adornedEnd: {
      color: theme.palette.grey[400]
    },
    adornedStart: {
      color: theme.palette.grey[400]
    },
    notchedOutline: {
      borderRadius: 8,
      borderColor: theme.palette.grey[200],
      ...theme.applyStyles('dark', {
        borderColor: theme.palette.grey[700]
      })
    },
    root: {
      [`&.${pickersOutlinedInputClasses.inputSizeSmall}`]: {
        fontSize: 14,
        paddingBlock: 4
      }
    }
  }
});
export const DesktopDatePicker = () => ({
  defaultProps: {
    slots: DatePicker()?.defaultProps?.slots,
    slotProps: {
      desktopPaper: {
        sx: {
          borderRadius: 2,
          boxShadow: 4
        }
      }
    }
  }
});
export const MobileDatePicker = () => ({
  defaultProps: DatePicker()?.defaultProps
});
export const StaticDatePicker = () => ({
  defaultProps: DatePicker()?.defaultProps
});

// ==============================================================
// TIME PICKER
// ==============================================================
export const TimePicker = () => ({
  defaultProps: {
    slots: {
      leftArrowIcon: props => <KeyboardArrowLeft {...props} fontSize="small" />,
      rightArrowIcon: props => <KeyboardArrowRight {...props} fontSize="small" />
    },
    slotProps: {
      mobilePaper: {
        sx: {
          padding: 2,
          boxShadow: 4,
          borderRadius: 2,
          '.MuiPickersArrowSwitcher-spacer': {
            width: 10
          },
          '.MuiClock-pmButton .MuiTypography-caption': {
            fontWeight: 600
          },
          '.MuiClock-amButton .MuiTypography-caption': {
            fontWeight: 600
          }
        }
      }
    }
  }
});
export const DesktopTimePicker = () => ({
  defaultProps: TimePicker()?.defaultProps
});

// ==============================================================
// DATE TIME PICKER
// ==============================================================
export const DateTimePicker = () => ({
  defaultProps: {
    slotProps: {
      desktopPaper: {
        sx: {
          borderRadius: 2,
          boxShadow: 4
        }
      }
    },
    slots: {
      openPickerIcon: CalendarMonthOutlined,
      switchViewIcon: props => <KeyboardArrowDown {...props} fontSize="small" />,
      leftArrowIcon: props => <KeyboardArrowLeft {...props} fontSize="small" />,
      rightArrowIcon: props => <KeyboardArrowRight {...props} fontSize="small" />
    }
  }
});
export const DesktopDateTimePicker = () => ({
  defaultProps: {
    slotProps: {
      desktopPaper: {
        sx: {
          borderRadius: 2,
          boxShadow: 4
        }
      }
    },
    slots: {
      openPickerIcon: CalendarMonthOutlined,
      switchViewIcon: props => <KeyboardArrowDown {...props} fontSize="small" />,
      leftArrowIcon: props => <KeyboardArrowLeft {...props} fontSize="small" />,
      rightArrowIcon: props => <KeyboardArrowRight {...props} fontSize="small" />
    }
  }
});
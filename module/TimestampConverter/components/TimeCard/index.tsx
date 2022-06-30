import { ChangeEvent, Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useTheme } from '@emotion/react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import dayjs from 'dayjs'
import {
  Card,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Switch,
  TextField,
  Theme,
  Typography
} from '@mui/material'
import { ContentCopyIcon } from '@/common/icon'

enum FormatType {
  DATE_TIME,
  TIME,
  DATE
}

const formatTypeList = [
  {
    value: FormatType.DATE_TIME,
    text: 'Datetime',
  },
  {
    value: FormatType.TIME,
    text: 'Time',
  },
  {
    value: FormatType.DATE,
    text: 'Date',
  }
]

const timeComponents = [
  {
    label: 'Year',
    getValue: (time: Date) => time.getFullYear(),
    setValue: (v: string, time: Date, setTime: Dispatch<SetStateAction<Date>>) => {
      setTime(new Date(dayjs(time).set('year', Number(v)).valueOf()))
    },
  },
  {
    label: 'Month',
    getValue: (time: Date) => time.getMonth() + 1,
    setValue: (v: string, time: Date, setTime: Dispatch<SetStateAction<Date>>) => {
      setTime(new Date(dayjs(time).set('month', Number(v) - 1).valueOf()))
    },
  },
  {
    label: 'Day',
    getValue: (v: Date) => v.getDate(),
    setValue: (v: string, time: Date, setTime: Dispatch<SetStateAction<Date>>) => {
      setTime(new Date(dayjs(time).set('date', Number(v)).valueOf()))
    },
  },
  {
    label: 'Hour',
    getValue: (v: Date) => v.getHours(),
    setValue: (v: string, time: Date, setTime: Dispatch<SetStateAction<Date>>) => {
      setTime(new Date(dayjs(time).set('hour', Number(v)).valueOf()))
    },
  },
  {
    label: 'Minute',
    getValue: (v: Date) => v.getMinutes(),
    setValue: (v: string, time: Date, setTime: Dispatch<SetStateAction<Date>>) => {
      setTime(new Date(dayjs(time).set('minute', Number(v)).valueOf()))
    },
  },
  {
    label: 'Second',
    getValue: (v: Date) => v.getSeconds(),
    setValue: (v: string, time: Date, setTime: Dispatch<SetStateAction<Date>>) => {
      setTime(new Date(dayjs(time).set('second', Number(v)).valueOf()))
    },
  },
]

function TimeCard(): JSX.Element {
  const theme = useTheme() as Theme
  const [time, setTime] = useState(new Date())
  const [isMilliseconds, setIsMilliseconds] = useState(true)
  const [formatType, setFormatType] = useState(FormatType.DATE_TIME)
  const [hour12, setHour12] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState(false)

  const timeStamp = useMemo(() => {
    return Math.floor(time.valueOf() / (isMilliseconds ? 1 : 1000))
  }, [time, isMilliseconds])
  const handleInputChange = useCallback((e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { value } = e.target
    if (!value) {
      return
    }
    if (value.length <= 10) {
      setIsMilliseconds(false)
      setTime(new Date(Number(value) * 1000))
    } else {
      setIsMilliseconds(true)
      setTime(new Date(Number(value)))
    }
  }, [])

  const ISOString = useMemo(() => time.toISOString(), [time])

  const formatted = useMemo(() => {
    if (formatType === FormatType.DATE_TIME) {
      return time.toLocaleString('en', { hour12 })
    } else if (formatType === FormatType.TIME) {
      return time.toLocaleTimeString('en', { hour12 })
    } else {
      return time.toLocaleDateString('en')
    }
  }, [hour12, time, formatType])

  const onCopy = useCallback(() => setShowSnackbar(true), [])

  const renderSnackBar = () => (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={showSnackbar}
      autoHideDuration={6000}
      onClose={() => setShowSnackbar(false)}
      message="Copied!"
    />
  )

  return (
    <>
      {renderSnackBar()}
      <Card
        sx={{
          width: '90%',
          height: '320px',
          margin: 'auto',
          backgroundColor: theme.palette.error.main,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            style={{ color: '#fff' }}
          >
            Time #1
          </Typography>

          <Divider />

          <Grid container spacing={2} style={{ marginTop: '4px' }}>
            <Grid item xs={4}>
              <TextField
                label="Unix Timestamp"
                variant="standard"
                value={timeStamp}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={1}>
              <CopyToClipboard text={String(timeStamp)} onCopy={onCopy}>
                <IconButton aria-label="content-copy">
                  <ContentCopyIcon />
                </IconButton>
              </CopyToClipboard>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            {timeComponents.map(({ label, getValue, setValue }) => (
              <Grid item xs={2} key={label}>
                <TextField
                  label={label}
                  variant="standard"
                  inputProps={{
                    type: 'number',
                  }}
                  margin="dense"
                  value={getValue(time)}
                  onChange={v => setValue(v.target.value, time, setTime)}
                />
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={2} style={{ marginTop: 0 }}>
            <Grid item xs={6} style={{ lineHeight: '40px' }}>UTC(ISO 8601)</Grid>
            <Grid item xs={5} style={{ lineHeight: '40px' }}>{ISOString}</Grid>
            <Grid item xs={1}>
              <CopyToClipboard text={ISOString} onCopy={onCopy}>
                <IconButton aria-label="content-copy">
                  <ContentCopyIcon />
                </IconButton>
              </CopyToClipboard>
            </Grid>
          </Grid>

          <Divider />

          <Grid container spacing={2} style={{ marginTop: 0 }}>
            <Grid item xs={3} style={{ paddingTop: '8px' }}>
              <FormControl variant="standard" sx={{ minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">Format</InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={formatType}
                  onChange={e => setFormatType(e.target.value as FormatType)}
                  label="Age"
                >
                  {formatTypeList.map(({ value, text }, index) => (
                    <MenuItem value={value} key={index}>{text}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormGroup>
                <FormControlLabel
                  control={(
                    <Switch
                      checked={hour12}
                      onChange={e => setHour12(e.target.checked)}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  )}
                  label={hour12 ? '12' : '24'}
                />
              </FormGroup>
            </Grid>
            <Grid item xs={5} style={{ lineHeight: '40px' }}>{formatted}</Grid>
            <Grid item xs={1}>
              <CopyToClipboard text={formatted} onCopy={onCopy}>
                <IconButton aria-label="content-copy">
                  <ContentCopyIcon />
                </IconButton>
              </CopyToClipboard>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default TimeCard
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Box } from '@mui/material';
import utc from "dayjs/plugin/utc";
import dayjs from 'dayjs';

//import dayjs from 'dayjs';

// eslint-disable-next-line react/prop-types
const DateInput = ({date, setDate, label, sx}) => {

    dayjs.extend(utc);
    const maxDate = dayjs("2023-12-31T23");
    const minDate = dayjs("2014-01-01 00");

  return (
    <Box sx={sx}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateTimePicker']}>
                <DateTimePicker 
                sx={{scale: 0.9}}
                views={['year', 'day', 'hours']}
                label={label}
                disableFuture
                ampm={false}
                value={date}
                timezone="UTC"
                minutesStep={60}
                secondsStep={0}
                maxDateTime={maxDate}
                minDateTime={minDate}
                onChange={(newDate) => setDate(newDate)} 
                />
            </DemoContainer>
        </LocalizationProvider>
    </Box>
  );
}

export default DateInput;
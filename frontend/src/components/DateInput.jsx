import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import utc from "dayjs/plugin/utc";
import dayjs from 'dayjs';

const DateInput = ({ date, setDate, label, sx }) => {

    dayjs.extend(utc);
    const maxDate = dayjs("2024-12-31T23:00Z");
    const minDate = dayjs("1940-01-01T00:00Z");

    return (
        <Box sx={sx}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker']}>
                    <DateTimePicker
                        sx={{ scale: 0.9 }}
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

DateInput.propTypes = {
    date: PropTypes.any,
    setDate: PropTypes.func,
    label: PropTypes.string,
    sx: PropTypes.object,
}

export default DateInput;
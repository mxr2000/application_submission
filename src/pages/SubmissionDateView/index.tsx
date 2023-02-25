import {
    Box, Checkbox,
    FormControl, FormControlLabel, FormGroup, FormLabel,
    Grid, TextField, Fab, Accordion, AccordionSummary, AccordionDetails, Typography, Switch, Toolbar, Paper

} from "@mui/material";
import SubmissionTable from "../SubmissionTable";
import React, {useState} from "react";
import {Submission, SubmissionStatus, UpdateType} from "../../models/model";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, {Dayjs} from "dayjs";
import AddIcon from '@mui/icons-material/Add';
import CreateSubmissionDialog from "../CreateSubmissionDialog";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CreateUpdateDialog from "../CreateUpdateDialog";


const capitalizeFirstLetter: (s: string) => string = s => {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

const seasons = new Map([
    ["1", "2023 Summer Intern"]
])


const SubmissionDateView = (props: {
    submissions: Submission[]
}) => {
    const {submissions} = props
    const [statusSet, setStatusSet] = useState<{ [key in SubmissionStatus]: boolean }>({
        'submitted': true,
        'offer': true,
        'rejected': true
    })

    const [seasonSet, setSeasonSet] = useState<{ [key: number]: boolean }>({
        1: true
    })

    const [updateSet, setUpdateSet] = useState<{ [key in UpdateType]: boolean }>({
        'oa': true,
        'bq': true,
        'vo1': true,
        'vo2': true,
        'vo3': true,
        'other': true,
        'vr': true
    })

    const handleStatusOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStatusSet({
            ...statusSet,
            [event.target.name]: event.target.checked,
        });
    };

    const handleSeasonOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSeasonSet({
            ...seasonSet,
            [event.target.name]: event.target.checked,
        });
    };

    const handleUpdateOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUpdateSet({
            ...updateSet,
            [event.target.name]: event.target.checked,
        });
    };

    const [showNoUpdateSubmission, setShowNoUpdateSubmission] = useState(true)

    const [fromDate, setFromDate] = React.useState<Dayjs>(dayjs('2018-04-13 19:18'));
    const [toDate, setToDate] = React.useState<Dayjs>(dayjs());

    const [useDateFilter, setUseDateFilter] = useState(false)
    const [useUpdateFilter, setUseUpdateFilter] = useState(false)
    const [useStatusFilter, setUseStatusFilter] = useState(false)
    const [useSeasonFilter, setUseSeasonFilter] = useState(false)

    const filteredSubmissions = submissions
        .filter(s => !useStatusFilter || statusSet[s.status])
        .filter(s => !useSeasonFilter || seasonSet[s.position.season.id])
        .filter(s => !useUpdateFilter || (showNoUpdateSubmission && s.updates.length === 0) || s.updates.some(u => updateSet[u.type]))
        .filter(s => !useDateFilter || (fromDate.isBefore(dayjs(s.submissionDate)) && toDate.isAfter(s.submissionDate)))

    const [openCreateSubmissionDialog, setOpenCreateSubmissionDialog] = useState(false)

    return (
        <Grid container={true} spacing={2} sx={{mt: 1}}>

            <Grid item={true} md={3} xs={12}>
                <Box sx={{width: "100%"}}>
                    {/*<Toolbar>
                        <Typography
                            sx={{ flex: '1 1 100%' }}
                            variant="h6"
                            id="tableTitle"
                            component="div"
                        >
                            Filters
                        </Typography>
                    </Toolbar>*/}
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>
                                Status</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormGroup>
                                {
                                    Object.entries(statusSet).map((s, i) => <FormControlLabel key={i}
                                                                                              control={<Checkbox
                                                                                                  disabled={!useStatusFilter}
                                                                                                  checked={s[1]}
                                                                                                  onChange={e => handleStatusOptionChange(e)}
                                                                                                  name={s[0]}/>}
                                                                                              label={capitalizeFirstLetter(s[0])}/>)
                                }
                            </FormGroup>
                            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                <FormControlLabel control={<Switch value={useStatusFilter}
                                                                   onChange={e => setUseStatusFilter(e.target.checked)}/>}
                                                  label="Apply"/>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Updates</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormGroup>
                                {
                                    Object.entries(updateSet).map((s, i) => <FormControlLabel key={i}
                                                                                              control={<Checkbox
                                                                                                  checked={s[1]}
                                                                                                  disabled={!useUpdateFilter}
                                                                                                  onChange={e => handleUpdateOptionChange(e)}
                                                                                                  name={s[0]}/>}
                                                                                              label={capitalizeFirstLetter(s[0])}/>)
                                }
                                <FormControlLabel
                                    control={<Checkbox
                                        disabled={!useUpdateFilter}
                                        checked={showNoUpdateSubmission}
                                        onChange={e => setShowNoUpdateSubmission(e.target.checked)}/>}
                                    label={"None"}/>
                            </FormGroup>
                            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                <FormControlLabel control={<Switch value={useUpdateFilter}
                                                                   onChange={e => setUseUpdateFilter(e.target.checked)}/>}
                                                  label="Apply"/>
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Seasons</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormGroup>
                                {
                                    Object.entries(seasonSet).map((s, i) => <FormControlLabel key={i}
                                                                                              control={<Checkbox
                                                                                                  disabled={!useSeasonFilter}
                                                                                                  checked={s[1]}
                                                                                                  onChange={e => handleSeasonOptionChange(e)}
                                                                                                  name={s[0]}/>}
                                                                                              label={seasons.get(s[0])}/>)
                                }
                            </FormGroup>
                            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                <FormControlLabel control={<Switch value={useSeasonFilter}
                                                                   onChange={e => setUseSeasonFilter(e.target.checked)}/>}
                                                  label="Apply"/>
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Date</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormGroup>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        disabled={!useDateFilter}
                                        label="from"
                                        value={fromDate}
                                        onChange={(newValue) => {
                                            if (newValue !== null) {
                                                setFromDate(newValue);
                                            }
                                        }}
                                        renderInput={(params) => <TextField sx={{mt: 2}} size={"small"} {...params} />}
                                    />
                                    <DatePicker
                                        disabled={!useDateFilter}
                                        label="to"
                                        value={toDate}
                                        onChange={(newValue) => {
                                            if (newValue !== null) {
                                                setToDate(newValue);
                                            }
                                        }}
                                        renderInput={(params) => <TextField sx={{mt: 2}}
                                                                            size={"small"} {...params} />}
                                    />
                                </LocalizationProvider>
                                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                    <FormControlLabel control={<Switch value={useDateFilter}
                                                                       onChange={e => setUseDateFilter(e.target.checked)}/>}
                                                      label="Apply"/>
                                </Box>
                            </FormGroup>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Grid>
            <Grid item={true} md={9} xs={12}>
                <SubmissionTable submissions={filteredSubmissions}/>
                <Grid container={true} justifyContent="flex-end" sx={{mt: 2}}>
                    <Fab color="primary" aria-label="add" onClick={e => {
                        setOpenCreateSubmissionDialog(true)
                    }}>
                        <AddIcon/>
                    </Fab>
                </Grid>
            </Grid>

            <CreateSubmissionDialog open={openCreateSubmissionDialog} setOpen={setOpenCreateSubmissionDialog}
                                    seasons={seasons}/>
        </Grid>
    )
}

export default SubmissionDateView
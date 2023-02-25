import {
    Box, Checkbox,
    FormControl, FormControlLabel, FormGroup, Autocomplete,
    Grid, TextField, Fab, Accordion, AccordionSummary, AccordionDetails, Typography, Switch, Toolbar, Paper, Button

} from "@mui/material";
import SubmissionTable from "../../components/SubmissionTable";
import React, {useState} from "react";
import {Submission, SubmissionStatus, UpdateType} from "../../models/model";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, {Dayjs} from "dayjs";
import AddIcon from '@mui/icons-material/Add';
import CreateSubmissionDialog from "../../components/CreateSubmissionDialog";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CreateUpdateDialog from "../../components/CreateUpdateDialog";
import {log} from "util";


const capitalizeFirstLetter: (s: string) => string = s => {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

const seasons = new Map([
    ["1", "2023 Summer Intern"],
    ["2", "2023 Summer Intern(China)"],
    ["3", "2023 Summer Intern(Singapore)"]
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
        1: true,
        2: true,
        3: true
    })

    const [updateSet, setUpdateSet] = useState<{ [key in UpdateType]: boolean }>({
        'oa': false,
        'bq': false,
        'vo1': false,
        'vo2': false,
        'vo3': false,
        'other': false,
        'vr': false
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

    const resetUpdateFilter = () => {
        setUpdateSet({
            'oa': false,
            'bq': false,
            'vo1': false,
            'vo2': false,
            'vo3': false,
            'other': false,
            'vr': false
        })
        setShowNoUpdateSubmission(false)
    }

    const [showNoUpdateSubmission, setShowNoUpdateSubmission] = useState(false)
    const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])

    const [fromDate, setFromDate] = React.useState<Dayjs>(dayjs('2018-04-13 19:18'));
    const [toDate, setToDate] = React.useState<Dayjs>(dayjs());

    const allCompanies = new Set(submissions.map(s => s.position.company.name))

    const [useDateFilter, setUseDateFilter] = useState(false)
    const [useUpdateFilter, setUseUpdateFilter] = useState(false)
    const [useStatusFilter, setUseStatusFilter] = useState(false)
    const [useSeasonFilter, setUseSeasonFilter] = useState(false)
    const [useCompanyFilter, setUseCompanyFilter] = useState(false)

    const filteredSubmissions = submissions
        .filter(s => !useCompanyFilter || selectedCompanies.some(c => s.position.company.name === c))
        .filter(s => !useStatusFilter || statusSet[s.status])
        .filter(s => !useSeasonFilter || seasonSet[s.position.season.id])
        .filter(s => !useUpdateFilter || (showNoUpdateSubmission && s.updates.length === 0) || s.updates.some(u => updateSet[u.type]))
        .filter(s => !useDateFilter || (fromDate.isBefore(dayjs(s.submissionDate)) && toDate.isAfter(s.submissionDate)))

    const [openCreateSubmissionDialog, setOpenCreateSubmissionDialog] = useState(false)

    return (
        <Grid container={true} spacing={2} sx={{mt: 1}}>

            <Grid item={true} md={3} xs={12}>
                <Box sx={{width: "100%"}}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>
                                Company</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Autocomplete
                                multiple
                                options={[...Array.from(allCompanies).sort()]}
                                getOptionLabel={name => name}

                                onChange={(e, newVal) => {
                                    setSelectedCompanies(newVal)
                                    console.log(newVal)
                                }}
                                value={selectedCompanies}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label="Select or search"
                                    />
                                )}
                            />
                            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                <FormControlLabel control={<Switch value={useCompanyFilter}
                                                                   onChange={e => setUseCompanyFilter(e.target.checked)}/>}
                                                  label="Apply"/>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion >
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
                                <Button sx={{mr: 2}} color={"primary"} onClick={resetUpdateFilter}>Reset</Button>

                                <FormControlLabel control={<Switch value={useUpdateFilter}
                                                                   onChange={e => {
                                                                       setUseUpdateFilter(e.target.checked)
                                                                       setShowNoUpdateSubmission(e.target.checked)
                                                                   }}/>}
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
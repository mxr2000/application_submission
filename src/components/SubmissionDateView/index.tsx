import {
    Box, Checkbox,
    FormControl, FormControlLabel, FormGroup, FormLabel,
    Grid, TextField, Fab

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

/*const submissions: Submission[] = [
    {
        "id": 3,
        "position": {
            "id": 3,
            "company": {
                "name": "TikTok",
            },
            "season": {
                "id": 1,
                "name": "2023 summer intern"
            },
            "name": "SDE"
        },
        "submissionDate": new Date("2022-08-04"),
        "updateDate": new Date("2022-10-10"),
        "status": "rejected",
        "updates": [
            {
                "id": 2,
                "notifyTime": new Date("2022-08-14"),
                "completeTime": new Date("2022-11-29"),
                "type": "oa",
            }
        ]
    },
    {
        "id": 4,
        "position": {
            "id": 4,
            "company": {
                "name": "TikTok",
            },
            "season": {
                "id": 1,
                "name": "2023 summer intern"
            },
            "name": "Lark SDE"
        },
        "submissionDate": new Date("2022-08-04T00:00:00-04:00"),
        "updateDate": new Date("2022-09-29"),
        "status": "rejected",
        "updates": []
    }
]*/

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

    const [fromDate, setFromDate] = React.useState<Dayjs | null>(dayjs('2018-04-13 19:18'));
    const [toDate, setToDate] = React.useState<Dayjs | null>(dayjs('2023-04-13 19:18'));
    const [useDateFilter, setUseDateFilter] = useState(false)

    const filteredSubmissions = submissions
        .filter(s => statusSet[s.status])
        .filter(s => seasonSet[s.position.season.id])
        .filter(s => (showNoUpdateSubmission && s.updates.length === 0) || s.updates.some(u => updateSet[u.type]))

    const [openCreateSubmissionDialog, setOpenCreateSubmissionDialog] = useState(false)

    return (
        <Grid container={true} spacing={2} sx={{mt: 2}}>
            <Grid item={true} xs={3}>
                <Box sx={{width: "100%"}}>
                    <FormControl>
                        <FormLabel component="legend">Status</FormLabel>
                        <FormGroup>
                            {
                                Object.entries(statusSet).map((s, i) => <FormControlLabel key={i}
                                                                                          control={<Checkbox
                                                                                              checked={s[1]}
                                                                                              onChange={e => handleStatusOptionChange(e)}
                                                                                              name={s[0]}/>}
                                                                                          label={capitalizeFirstLetter(s[0])}/>)
                            }
                        </FormGroup>
                    </FormControl>
                </Box>
                <Box sx={{width: "100%"}}>
                    <FormControl>
                        <FormLabel component="legend">Updates</FormLabel>
                        <FormGroup>
                            {
                                Object.entries(updateSet).map((s, i) => <FormControlLabel key={i}
                                                                                          control={<Checkbox
                                                                                              checked={s[1]}
                                                                                              onChange={e => handleUpdateOptionChange(e)}
                                                                                              name={s[0]}/>}
                                                                                          label={capitalizeFirstLetter(s[0])}/>)
                            }
                            <FormControlLabel
                                control={<Checkbox
                                    checked={showNoUpdateSubmission}
                                    onChange={e => setShowNoUpdateSubmission(e.target.checked)}/>}
                                label={"None"}/>
                        </FormGroup>
                    </FormControl>
                </Box>
                <Box sx={{width: "100%"}}>
                    <FormControl>
                        <FormLabel component="legend">Seasons</FormLabel>
                        <FormGroup>
                            {
                                Object.entries(seasonSet).map((s, i) => <FormControlLabel key={i}
                                                                                          control={<Checkbox
                                                                                              checked={s[1]}
                                                                                              onChange={e => handleSeasonOptionChange(e)}
                                                                                              name={s[0]}/>}
                                                                                          label={seasons.get(s[0])}/>)
                            }
                        </FormGroup>
                    </FormControl>
                </Box>

                <Box sx={{width: "100%"}}>
                    <FormControl>
                        <FormLabel component="legend">Date</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox
                                    checked={useDateFilter}
                                    onChange={e => setUseDateFilter(e.target.checked)}/>}
                                label={"Apply"}/>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    disabled={!useDateFilter}
                                    label="from"
                                    value={fromDate}
                                    onChange={(newValue) => {
                                        setFromDate(newValue);
                                    }}
                                    renderInput={(params) => <TextField sx={{mt: 2}} size={"small"} {...params} />}
                                />
                                <DatePicker
                                    disabled={!useDateFilter}
                                    label="to"
                                    value={toDate}
                                    onChange={(newValue) => {
                                        setToDate(newValue);
                                    }}
                                    renderInput={(params) => <TextField sx={{mt: 2}}
                                                                        size={"small"} {...params} />}
                                />
                            </LocalizationProvider>
                        </FormGroup>
                    </FormControl>
                </Box>
            </Grid>
            <Grid item={true} xs={9}>
                <SubmissionTable submissions={filteredSubmissions}/>
                <Grid container={true} justifyContent="flex-end" sx={{mt: 2}}>
                    <Fab color="primary" aria-label="add" onClick={e => {setOpenCreateSubmissionDialog(true)}}>
                        <AddIcon />
                    </Fab>
                </Grid>
            </Grid>

            <CreateSubmissionDialog open={openCreateSubmissionDialog} setOpen={setOpenCreateSubmissionDialog} seasons={seasons}/>
        </Grid>
    )
}

export default SubmissionDateView
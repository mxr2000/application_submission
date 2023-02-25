import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    Select,
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    Button
} from "@mui/material";
import React, {Dispatch, SetStateAction, useContext, useState} from "react";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import {createSubmission} from "../../models/request";
import {SubmissionsContext} from "../../contexts/SubmissionsContext";
import {AlertSnackbarContext} from "../../contexts/AlertSnackbarContext";


const formatName: (s: string) => string = s => {
    return s.split(" ").map(p => p[0].toUpperCase() + p.slice(1)).join(" ")
}

const CreateSubmissionDialog = (props: {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    seasons: Map<string, string>
}) => {
    const {open, setOpen, seasons} = props

    const close = () => {
        setOpen(false)
    }

    const [selectedCompanyName, setSelectedCompanyName] = useState("")
    const [companyName, setCompanyName] = useState('')
    const [positionName, setPositionName] = useState('')
    const [seasonId, setSeasonId] = useState('1')
    const [date, setDate] = useState<Dayjs | null>(dayjs());

    const {submissions, setSubmissions} = useContext(SubmissionsContext)

    const {showSuccess, showError} = useContext(AlertSnackbarContext)

    const companyNames = Array.from(new Set(submissions.map(s => s.position.company.name))).sort()

    const submit = () => {
        if (companyName === "" || positionName === "" || !date) {
            showError("input bad format")
            return
        }
        createSubmission({
            companyName: formatName(companyName),
            positionName: formatName(positionName),
            seasonId: parseInt(seasonId),
            submissionDate: date.format('YYYY-MM-DD')
        })
            .then(r => {
                setSubmissions([...submissions, r])
                showSuccess("Successfully create submission")
                close()
            })
            .catch(err => showError(err))
    }

    return (
        <Dialog open={open} onClose={close} >
            <DialogTitle>
                Create New Submission
            </DialogTitle>
            <DialogContent>
                <Grid container={true} spacing={2} sx={{mt: 1}}>
                    <Grid item={true} md={6}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Company</InputLabel>
                            <Select
                                value={selectedCompanyName}
                                label="Company"
                                onChange={e => {
                                    setSelectedCompanyName(e?.target.value)
                                    setCompanyName(e?.target.value)
                                }}
                            >
                                {
                                    companyNames.map((c, i) => <MenuItem value={c} key={i}>{c}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item={true} md={6}>
                        <FormControl fullWidth={true}>
                            <TextField label={"Company Name"} value={companyName} onChange={e => setCompanyName(e.target.value)}/>
                        </FormControl>
                    </Grid>
                    <Grid item={true} md={12}>
                        <FormControl fullWidth={true}>
                            <TextField label={"Position Name"} value={positionName} onChange={e => setPositionName(e.target.value)}/>
                        </FormControl>
                    </Grid>
                    <Grid item={true} md={12}>
                        <FormControl fullWidth>
                            <InputLabel>Season</InputLabel>
                            <Select
                                value={seasonId}
                                label="Season"
                                onChange={e => {
                                    setSeasonId(e?.target.value)
                                }}
                            >
                                {
                                    Array.from(seasons.keys()).map((id, i) => <MenuItem key={i} value={id}>{seasons.get(id)}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item={true} md={12}>
                        <FormControl fullWidth>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="submission date"
                                    value={date}
                                    onChange={(newValue) => {
                                        setDate(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </FormControl>

                    </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        sx={{ mt: 3, ml: 1 }}
                        onClick={submit}
                    >
                        Submit
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default CreateSubmissionDialog
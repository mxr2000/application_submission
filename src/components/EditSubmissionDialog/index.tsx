import {
    Dialog,
    DialogContent,
    DialogTitle,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell, Typography, TableBody, TextField, Button, Box, Grid, InputLabel, Select, MenuItem, FormControl
} from "@mui/material";
import React, {Dispatch, SetStateAction, useContext, useState} from "react";
import {Submission, SubmissionStatus} from "../../models/model";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import CreateUpdateDialog from "../CreateUpdateDialog";
import {updateSubmissionStatus, updateUpdateCompleteTime} from "../../models/request";
import {AlertSnackbarContext} from "../../contexts/AlertSnackbarContext";
import {SubmissionsContext} from "../../contexts/SubmissionsContext";

const DateSelector = ({onSubmit}: {
    onSubmit: (date: Dayjs) => void
}) => {
    const [date, setDate] = useState<Dayjs | null>(null)
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label="set"
                value={date}
                onChange={(newValue) => {
                    if (newValue !== null) {
                        setDate(newValue);
                        onSubmit(newValue)
                    }
                }}
                renderInput={(params) => <TextField size={"small"} {...params} />}
            />

        </LocalizationProvider>
    )
}

const EditSubmissionDialog = (props: {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    submission?: Submission,
}) => {
    const {open, setOpen, submission} = props
    const close = () => {
        setOpen(false)
    }
    const [openCreateUpdateDialog, setOpenCreateUpdateDialog] = useState(false)

    const [status, setStatus] = useState<SubmissionStatus>("submitted")
    const [date, setDate] = useState<Dayjs>(dayjs());

    const {showSuccess, showError} = useContext(AlertSnackbarContext)
    const {submissions, setSubmissions} = useContext(SubmissionsContext)

    if (submission === undefined) {
        return <div/>
    }

    const submitCompleteTime: (id: number, date: Dayjs) => void = (id, date) => {
        updateUpdateCompleteTime({
            updateId: id,
            time: date.format('YYYY-MM-DD')
        })
            .then(data => {
                const sIndex = submissions.findIndex(s => s.id === submission.id)
                const s = submissions[sIndex]
                const uIndex = s.updates.findIndex(u => u.id === id)
                setSubmissions([
                    ...submissions.slice(0, sIndex),
                    {
                        ...submissions[sIndex],
                        updates: [
                            ...s.updates.slice(0, uIndex),
                            {
                                ...s.updates[uIndex],
                                completeTime: date.format('YYYY-MM-DD')
                            },
                            ...s.updates.slice(uIndex + 1)
                        ]
                    },
                    ...submissions.slice(sIndex + 1)
                ])
                showSuccess("Update Success")
            })
            .catch(err => showError(err))
    }


    const updateStatus = () => {
        updateSubmissionStatus({
            applicationId: submission.id,
            status: status,
            updateDate: date.format('YYYY-MM-DD')
        })
            .then(data => {
                const sIndex = submissions.findIndex(s => s.id === submission.id)
                setSubmissions([
                    ...submissions.slice(0, sIndex),
                    {
                        ...submissions[sIndex],
                        status: status,
                        updateDate: date.format('YYYY-MM-DD')
                    },
                    ...submissions.slice(sIndex + 1)
                ])
                showSuccess("Update success")
            })
            .catch(err => showError(err))
    }

    return (

        <Dialog open={open} onClose={close}>
            <DialogTitle>
                Edit Submission {"" + submission.id}
            </DialogTitle>
            <DialogContent>
                <Grid container={true} spacing={2} sx={{mt: 1}}>
                    <Grid item={true} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>New Status</InputLabel>
                            <Select
                                value={status}
                                label="Company"
                                onChange={e => {
                                    if (e instanceof Event) {
                                        setStatus(e.target.value)
                                    }
                                }}
                            >
                                <MenuItem value={"submitted"}>submitted</MenuItem>
                                <MenuItem value={"rejected"}>rejected</MenuItem>
                                <MenuItem value={"offer"}>offer</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={6}>
                        <FormControl fullWidth>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="update date"
                                    value={date}
                                    onChange={(newValue) => {
                                        if (newValue !== null) {
                                            setDate(newValue)
                                        }
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
                        onClick={updateStatus}
                    >
                        Update Status
                    </Button>
                </Box>

                <Typography variant={"h6"}>Updates</Typography>
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 450}}>
                        <TableHead>
                            <TableRow>
                                <TableCell>id</TableCell>
                                <TableCell>type</TableCell>
                                <TableCell>notify date</TableCell>
                                <TableCell>complete date</TableCell>
                                <TableCell>spec</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                submission.updates.map((u, i) => <TableRow key={i}>
                                    <TableCell>{"" + u.id}</TableCell>
                                    <TableCell>{u.type}</TableCell>
                                    <TableCell>{u.notifyTime}</TableCell>
                                    <TableCell>{u.completeTime === null ? <DateSelector onSubmit={date => submitCompleteTime(u.id, date)}/> : u.completeTime}</TableCell>
                                    <TableCell>{u.spec ?? ""}</TableCell>
                                </TableRow>)
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        sx={{ mt: 3, ml: 1 }}
                        onClick={() => setOpenCreateUpdateDialog(true)}
                    >
                        Create update
                    </Button>
                </Box>
                <CreateUpdateDialog open={openCreateUpdateDialog} setOpen={setOpenCreateUpdateDialog} id={submission.id}/>
            </DialogContent>
        </Dialog>


    )
}


export default EditSubmissionDialog
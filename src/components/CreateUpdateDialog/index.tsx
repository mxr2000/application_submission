import React, {Dispatch, SetStateAction, useContext, useState} from "react";
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
import {Submission, Update, UpdateType} from "../../models/model";
import dayjs, {Dayjs} from "dayjs";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {createUpdate} from "../../models/request";
import {AlertSnackbarContext} from "../../contexts/AlertSnackbarContext";
import {SubmissionsContext} from "../../contexts/SubmissionsContext";

const CreateUpdateDialog = (props: {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    id: number
}) => {
    const {open, setOpen, id} = props
    const [type, setType] = useState<UpdateType>('oa')
    const [date, setDate] = useState<Dayjs>(dayjs())
    const [spec, setSpec] = useState('')

    const types: UpdateType[] = ["bq", "oa", "vo1", "vo2", "vo3", "vr", "other"]

    const close = () => {
        setOpen(false)
    }

    const {showSuccess, showError} = useContext(AlertSnackbarContext)
    const {submissions, setSubmissions} = useContext(SubmissionsContext)

    const updateSubmission = (update: Update) => {
        const sIndex = submissions.findIndex(s => s.id === id)
        const newSubmission: Submission[] = [
            ...submissions.slice(0, sIndex), {
                ...submissions[sIndex],
                updates: [...submissions[sIndex].updates, update]
            }, ...submissions.slice(sIndex + 1)]
        setSubmissions(newSubmission)
    }

    const submit = () => {
        createUpdate({
            applicationId: id,
            type: type,
            notifyTime: date.format('YYYY-MM-DD'),
            spec: spec
        })
            .then(update => {
                showSuccess("Successfully create update")
                updateSubmission(update)
                close()
            })
            .catch(err => showError(err))
    }

    return (
        <Dialog open={open} onClose={close}>
            <DialogTitle>
                Create New Update
            </DialogTitle>
            <DialogContent>
                <Grid container={true} spacing={2} sx={{mt: 1}}>
                    <Grid item md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={type}
                                label="Season"
                                onChange={e => {
                                    if (e instanceof Event) {
                                        setType(e.target.value)
                                    }
                                }}
                            >
                                {
                                    types.map((t, i) => <MenuItem key={i} value={t}>{t}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={6}>
                        <FormControl fullWidth>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="notify date"
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
                    <Grid item={true} md={12}>
                        <FormControl fullWidth>
                            <TextField label={"Specification"} value={spec} onChange={e => setSpec(e.target.value)}/>
                        </FormControl>
                    </Grid>
                </Grid>

                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button
                        variant="contained"
                        sx={{mt: 3, ml: 1}}
                        onClick={submit}
                    >
                        Submit
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default CreateUpdateDialog
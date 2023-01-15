import {
    Box,
    Paper,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Stack,
    Chip,
    IconButton
} from "@mui/material";
import {Submission} from "../../models/model";
import EditIcon from '@mui/icons-material/Edit';
import {useState} from "react";
import EditSubmissionDialog from "../EditSubmissionDialog";


const SubmissionTable = (props: {
    submissions: Submission[]
}) => {
    const {submissions} = props

    const [openEditSubmissionDialog, setOpenEditSubmissionDialog] = useState(false)
    const [editSubmissionId, setEditSubmissionId] = useState<number | null>(null)

    return (
        <Box sx={{width: '100%'}}>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>id</TableCell>
                            <TableCell>Company Name</TableCell>
                            <TableCell>Position Name</TableCell>
                            <TableCell>Submission Date</TableCell>
                            <TableCell>Update Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Updates</TableCell>
                            <TableCell>Edit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            submissions.map((s, i) => <TableRow key={i}>
                                <TableCell>{s.id}</TableCell>
                                <TableCell>{s.position.company.name}</TableCell>
                                <TableCell>{s.position.name}</TableCell>
                                <TableCell>{s.submissionDate}</TableCell>
                                <TableCell>{s.updateDate}</TableCell>
                                <TableCell>{s.status}</TableCell>
                                <TableCell>
                                    <Stack direction={"row"} spacing={1}>
                                        {
                                            s.updates.map((u, j) => <Chip key={j} size={"small"} label={u.type}/>)
                                        }
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <IconButton size={"small"} onClick={() => {
                                        setEditSubmissionId(s.id)
                                        setOpenEditSubmissionDialog(true)
                                    }}>
                                        <EditIcon fontSize={"inherit"}/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>)
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <EditSubmissionDialog open={openEditSubmissionDialog} setOpen={setOpenEditSubmissionDialog}
                                  submission={editSubmissionId === null ? undefined : submissions.filter(s => s.id === editSubmissionId)[0]}/>
        </Box>
    )
}

export default SubmissionTable
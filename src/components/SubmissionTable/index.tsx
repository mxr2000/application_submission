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
    IconButton, Toolbar, Typography, TablePagination, TableSortLabel
} from "@mui/material";
import {Submission, UpdateType} from "../../models/model";
import EditIcon from '@mui/icons-material/Edit';
import {useState} from "react";
import EditSubmissionDialog from "../EditSubmissionDialog";
import {blue, brown, green, grey, yellow} from "@mui/material/colors";
import dayjs from "dayjs";


const updateColors: Map<UpdateType, string> = new Map<UpdateType, string>([
    ["oa", brown[200]],
    ["bq", green[400]],
    ["vo1", blue[200]],
    ["vo2", blue[400]],
    ["vo3", blue[600]],
    ["vr", yellow[200]],
    ["other", grey[200]]
])

const SubmissionTable = (props: {
    submissions: Submission[]
}) => {
    const {submissions} = props

    const [openEditSubmissionDialog, setOpenEditSubmissionDialog] = useState(false)
    const [editSubmissionId, setEditSubmissionId] = useState<number | null>(null)

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const comparator: (a: Submission, b: Submission) => number = (a, b) => {
        return (order === 'asc' ? 1 : -1) * (dayjs(a.submissionDate).unix() - dayjs(b.submissionDate).unix())
    }

    return (
        <Box sx={{width: '100%'}}>
            <Paper>
                <Toolbar>
                    <Typography
                        sx={{flex: '1 1 100%'}}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        Submissions
                    </Typography>
                </Toolbar>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>id</TableCell>
                                <TableCell>Company Name</TableCell>
                                <TableCell>Position Name</TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction={order}
                                        active={true}
                                        onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                                    >
                                        Submission Date
                                    </TableSortLabel></TableCell>
                                <TableCell>Update Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Updates</TableCell>
                                <TableCell>Edit</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                submissions
                                    .sort(comparator)
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((s, i) => <TableRow key={i}>
                                        <TableCell>{s.id}</TableCell>
                                        <TableCell>{s.position.company.name}</TableCell>
                                        <TableCell>{s.position.name}</TableCell>
                                        <TableCell>{s.submissionDate}</TableCell>
                                        <TableCell>{s.updateDate}</TableCell>
                                        <TableCell><Chip size={"small"} label={s.status}
                                                         color={s.status === "submitted" ? "default" : (s.status === "rejected" ? "error" : "success")}/></TableCell>
                                        <TableCell>
                                            <Stack direction={"row"} spacing={1}>
                                                {
                                                    s.updates.map((u, j) => <Chip
                                                        sx={{backgroundColor: updateColors.get(u.type)}} key={j}
                                                        size={"small"}
                                                        label={u.type}/>)
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
                <TablePagination count={submissions.length}
                                 component="div"
                                 page={page}
                                 rowsPerPageOptions={[5, 10, 25]}
                                 onRowsPerPageChange={handleChangeRowsPerPage}
                                 onPageChange={handleChangePage}
                                 rowsPerPage={rowsPerPage}/>
            </Paper>
            <EditSubmissionDialog open={openEditSubmissionDialog} setOpen={setOpenEditSubmissionDialog}
                                  submission={editSubmissionId === null ? undefined : submissions.filter(s => s.id === editSubmissionId)[0]}/>
        </Box>
    )
}

export default SubmissionTable
import * as React from 'react';
import {Container, Grid, Paper, Typography} from "@mui/material";
import {Pie} from '@ant-design/plots';
import {useContext} from "react";
import {SubmissionsContext} from "../../contexts/SubmissionsContext";
import {Submission} from "../../models/model";
import {Column} from "@ant-design/charts";
import dayjs from "dayjs";


const StatusPieChart = ({submissions}: {
    submissions: Submission[]
}) => {
    const data: Record<string, any>[] = [
        {
            type: 'rejected',
            value: submissions.filter(s => s.status === "rejected").length
        },
        {
            type: 'submitted',
            value: submissions.filter(s => s.status === "submitted").length
        },
        {
            type: 'offer',
            value: submissions.filter(s => s.status === "offer").length
        }
    ]
    return (
        <Paper sx={{p: 2}}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>Status</Typography>
            <Pie
                data={data}
                angleField='value'
                colorField='type'
                radius={0.9}/>
        </Paper>
    )
}

const UpdatePieChart = ({submissions}: {
    submissions: Submission[]
}) => {
    const data: Record<string, any>[] = [
        {
            type: 'bq',
            value: submissions.filter(s => s.updates.some(u => u.type === "bq")).length
        },
        {
            type: 'oa',
            value: submissions.filter(s => s.status === "rejected").length
        },
        {
            type: 'vo',
            value: submissions.filter(s => s.status === "submitted").length
        },
        {
            type: 'other',
            value: submissions.filter(s => s.status === "offer").length
        }
    ]
    return (
        <Paper>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>Status</Typography>
            <Pie
                data={data}
                angleField='value'
                colorField='type'
                radius={0.9}/>
        </Paper>
    )
}

const StatusColumnChart = ({submissions}: {
    submissions: Submission[]
}) => {

    const [fromYear, fromMonth] = [2022, 8]
    const [toYear, toMonth] = [dayjs().year(), dayjs().month() + 1]
    let data: Record<string, any>[] = []
    for (let year = fromYear; year <= toYear; year++) {
        for (let month = (year === fromYear ? fromMonth : 1); month <= (year === toYear ? toMonth : 12); month++) {
            data.push({
                month: "" + year + "." + month,
                value: submissions.filter(s => s.status === "rejected" &&
                    parseInt(s.submissionDate.split("-")[0]) === year && parseInt(s.submissionDate.split("-")[1]) === month).length,
                type: 'rejected'
            })
            data.push({
                month: "" + year + "." + month,
                value: submissions.filter(s => s.status === "submitted" &&
                    parseInt(s.submissionDate.split("-")[0]) === year && parseInt(s.submissionDate.split("-")[1]) === month).length,
                type: 'submitted'
            })
        }
    }

    return (
        <Paper sx={{p: 2}}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>Status</Typography>
            <Column
                data={data}
                xField={"month"}
                yField={"value"}
                seriesField={"type"}
                isStack={true}
                label={{
                    position: 'middle'
                }}
            />
        </Paper>
    )
}

const UpdateColumnChart = ({submissions}: {
    submissions: Submission[]
}) => {

    const [fromYear, fromMonth] = [2022, 8]
    const [toYear, toMonth] = [dayjs().year(), dayjs().month() + 1]
    let data: Record<string, any>[] = []
    for (let year = fromYear; year <= toYear; year++) {
        for (let month = (year === fromYear ? fromMonth : 1); month <= (year === toYear ? toMonth : 12); month++) {
            const oaCount = submissions.filter(
                s => s.updates.some(
                    u => u.type === "oa" &&
                        parseInt(u.notifyTime.split("-")[0]) === year && parseInt(u.notifyTime.split("-")[1]) === month)
            ).length
            const bqCount = submissions.filter(
                s => s.updates.some(
                    u => u.type === "bq" &&
                        parseInt(u.notifyTime.split("-")[0]) === year && parseInt(u.notifyTime.split("-")[1]) === month)
            ).length
            const voCount = submissions.filter(
                s => s.updates.some(
                    u => (u.type === "vo1" || u.type === "vo2" || u.type === "vo3") &&
                        parseInt(u.notifyTime.split("-")[0]) === year && parseInt(u.notifyTime.split("-")[1]) === month)
            ).length
            if (oaCount > 0) {
                data.push({
                    month: "" + year + "." + month,
                    value: oaCount,
                    type: 'oa'
                })
            }

            if (bqCount > 0) {
                data.push({
                    month: "" + year + "." + month,
                    value: bqCount,
                    type: 'bq'
                })
            }
            if (voCount > 0) {
                data.push({
                    month: "" + year + "." + month,
                    value: voCount,
                    type: 'vo'
                })
            }
        }
    }

    return (
        <Paper sx={{p: 2}}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>Update</Typography>
            <Column
                data={data}
                xField={"month"}
                yField={"value"}
                seriesField={"type"}
                isStack={true}
                label={{
                    position: 'middle'
                }}
            />
        </Paper>
    )
}

const AnalysisPage = () => {

    const {submissions} = useContext((SubmissionsContext))

    return (
        <Container sx={{mt: 4, mb: 4}}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <StatusPieChart submissions={submissions}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <StatusColumnChart submissions={submissions}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <UpdateColumnChart submissions={submissions}/>
                </Grid>
            </Grid>
        </Container>
    )
}

export default AnalysisPage
import React, {useEffect, useState} from 'react';
import './App.css';
import {Container, Snackbar, Alert, Box, AppBar, Toolbar, Typography, Button} from "@mui/material";
import SubmissionDateView from "./pages/SubmissionDateView";
import {getAllSubmissions} from "./models/request";
import {Submission} from "./models/model";
import {SubmissionsContext} from './contexts/SubmissionsContext'
import {AlertSnackbarContext} from './contexts/AlertSnackbarContext'
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import {grey} from "@mui/material/colors";
import AnalysisPage from "./pages/AnalysisPage";

function App() {
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [openAlertSnackbar, setOpenAlertSnackbar] = useState(false)
    const [alertType, setAlertType] = useState<"success" | "error">("success")
    const [alertMessage, setAlertMessage] = useState("")
    useEffect(() => {
        getAllSubmissions().then(submissions => {
            setSubmissions(submissions)
        })
    }, [])

    const showError = (text: string) => {
        setOpenAlertSnackbar(true)
        setAlertType("error")
        setAlertMessage(text)
    }

    const showSuccess = (text: string) => {
        setOpenAlertSnackbar(true)
        setAlertType("success")
        setAlertMessage(text)
    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlertSnackbar(false)
    };

    return (

        <SubmissionsContext.Provider value={{submissions: submissions, setSubmissions: setSubmissions}}>
            <AlertSnackbarContext.Provider value={{showSuccess: showSuccess, showError: showError}}>

                <BrowserRouter>
                <Box sx={{width: "100%", backgroundColor: grey[100]}}>
                    <AppBar position="static" sx={{width: "100%"}}>
                        <Toolbar>

                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                News
                            </Typography>
                            <Link to={"/"} style={{textDecoration: 'none'}}><Button sx={{color: "white"}}>Main</Button></Link>
                            <Link to={"/analysis"} style={{textDecoration: 'none'}}><Button  sx={{color: "white"}}>Analysis</Button></Link>
                        </Toolbar>
                    </AppBar>
                    <Container>

                            <Routes>
                                <Route path="/" element={<SubmissionDateView submissions={submissions}/>}/>
                                <Route path="/analysis" element={<AnalysisPage/>}/>
                            </Routes>
                    </Container>
                    <Snackbar open={openAlertSnackbar} autoHideDuration={6000} onClose={handleClose}
                              anchorOrigin={{vertical: "top", horizontal: "right"}}>
                        <Alert onClose={handleClose} severity={alertType} sx={{width: '100%'}}>
                            {alertMessage}
                        </Alert>
                    </Snackbar>
                </Box>
                </BrowserRouter>


            </AlertSnackbarContext.Provider>
        </SubmissionsContext.Provider>

    );
}

export default App;

import React, {useEffect, useState} from 'react';
import './App.css';
import {Container} from "@mui/material";
import SubmissionDateView from "./components/SubmissionDateView";
import {getAllSubmissions} from "./models/request";
import {Submission} from "./models/model";
import {SubmissionsContext} from './contexts/SubmissionsContext'

function App() {
    const [submissions, setSubmissions] = useState<Submission[]>([])
    useEffect(() => {
        getAllSubmissions().then(submissions => {
            setSubmissions(submissions)
        })
    }, [])
    return (
        <SubmissionsContext.Provider value={{submissions: submissions, setSubmissions: setSubmissions}}>
            <Container sx={{maxWidth: 1200, minWidth: 1000}}>
                <SubmissionDateView submissions={submissions}/>
            </Container>
        </SubmissionsContext.Provider>

    );
}

export default App;

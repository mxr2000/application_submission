import React from "react";
import {Submission} from "../models/model";

export const SubmissionsContext =
    React.createContext<{
        submissions: Submission[],
        setSubmissions: (submissions: Submission[]) => void
    }>({
        submissions: [],
        setSubmissions: submissions => {}
    })
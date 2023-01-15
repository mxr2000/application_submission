import axios, {AxiosError, AxiosResponse} from "axios";
import {Submission} from "./model";

type CreateSubmissionRequest = {
    companyName: string,
    positionName: string,
    seasonId: number,
    submissionDate: string
}

const host = "http://blogservice-env.eba-nbmudfsy.us-east-1.elasticbeanstalk.com/"

const createSubmission: (req: CreateSubmissionRequest) => Promise<Submission> = req => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'POST',
            url: host + "application/",
            data: req
        })
            .then((resp: AxiosResponse<Submission>) => resolve(resp.data))
            .catch((err: AxiosError<string>) => reject(err.response?.data))
    })

}

const getAllSubmissions: () => Promise<Submission[]> = () => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'GET',
            url: host + "application/"
        })
            .then((resp: AxiosResponse<Submission[]>) => resolve(resp.data))
            .catch((err: AxiosError<string>) => reject(err.response?.data))
    })
}


export type {CreateSubmissionRequest}

export {getAllSubmissions, createSubmission}
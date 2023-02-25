import axios, {AxiosError, AxiosResponse} from "axios";
import {Submission, Update} from "./model";

type CreateSubmissionRequest = {
    companyName: string,
    positionName: string,
    seasonId: number,
    submissionDate: string
}

type UpdateUpdateCompleteTimeRequest = {
    time: string,
    updateId: number
}

type CreateUpdateRequest = {
    applicationId: number,
    notifyTime: string,
    spec: string,
    type: string
}

type UpdateSubmissionStatusRequest = {
    applicationId: number,
    status: string,
    updateDate: string
}

const host = "http://blogservice-env.eba-nbmudfsy.us-east-1.elasticbeanstalk.com/"

const createSubmission: (req: CreateSubmissionRequest) => Promise<Submission> = req => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'POST',
            url: host + "application",
            data: req
        })
            .then((resp: AxiosResponse<Submission>) => resolve(resp.data))
            .catch((err: AxiosError<string>) => reject(err.response?.data))
    })

}

const createUpdate: (req: CreateUpdateRequest) => Promise<Update> = req => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'POST',
            url: host + "update",
            data: req
        })
            .then((resp: AxiosResponse<Update>) => resolve(resp.data))
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

const updateUpdateCompleteTime: (req: UpdateUpdateCompleteTimeRequest) => Promise<string> = req => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'PUT',
            url: host + "update/complete_time",
            data: req
        })
            .then((resp: AxiosResponse<string>) =>resolve(resp.data))
            .catch((err: AxiosError<string>) => reject(err.response?.data))
    })
}

const updateSubmissionStatus: (req: UpdateSubmissionStatusRequest) => Promise<string> = req => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'PUT',
            url: host + "application",
            data: req
        })
            .then((resp: AxiosResponse<string>) => resolve(resp.data))
            .catch((err: AxiosError<string>) => reject(err.response?.data))
    })
}


export type {CreateSubmissionRequest, UpdateUpdateCompleteTimeRequest}

export {getAllSubmissions, createSubmission, updateUpdateCompleteTime, createUpdate, updateSubmissionStatus}
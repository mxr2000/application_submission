type Company = {
    name: string,
    spec?: string
}

type Season = {
    id: number,
    name: string
}

type Position = {
    id: number,
    company: Company,
    season: Season,
    name: string
}

type UpdateType = 'bq' | 'oa' | 'vo1' | 'vo2' | 'vo3' | 'other' | 'vr'

type Update = {
    id: number,
    notifyTime: string,
    completeTime?: string,
    type: UpdateType,
    spec?: string
}

type SubmissionStatus =
    'submitted' |
    'rejected' |
    'offer'


type Submission = {
    id: number,
    position: Position,
    submissionDate: string,
    updateDate: string,
    status: SubmissionStatus
    updates: Update[]
}

export type {Company, Season, Position, Update, Submission, UpdateType, SubmissionStatus}
import {Dialog, DialogTitle} from "@mui/material";
import React, {Dispatch, SetStateAction} from "react";
import {Submission} from "../../models/model";


const EditSubmissionDialog = (props: {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    submission?: Submission,
}) => {
    const {open, setOpen, submission} = props
    const close = () => {
        setOpen(false)
    }
    return (

        <Dialog open={open} onClose={close}>
            {
                submission === undefined ? <div/> :
                <DialogTitle>
                    Edit Submission {"" + submission.id}
                </DialogTitle>
            }
        </Dialog>


    )
}


export default EditSubmissionDialog
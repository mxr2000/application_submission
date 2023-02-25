import React from "react";

export const AlertSnackbarContext =
    React.createContext<{
        showError: (text: string) => void,
        showSuccess: (text: string) => void
    }>({
        showError: text => {},
        showSuccess: text => {}
    })
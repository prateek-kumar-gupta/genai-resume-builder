import { createContext ,  useState } from "react";



export const InterviewContext = createContext()

export const InterviewProvider = ({ children }) => {
    const [report , setReport] = useState(null)
    const [loading , setLoading] = useState(false)
    const[reports , setReports] = useState([])

    
    return (
        <InterviewContext.Provider value={{report , loading , setReport , setLoading , reports , setReports}}>
            {children}
        </InterviewContext.Provider>
    )
}

export const useInterview = () => {
    return useContext(InterviewContext)
}
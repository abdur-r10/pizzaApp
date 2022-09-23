import {useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function VerifyEmail() {
    let navigate = useNavigate()
    const [validUrl, setValidUrl] = useState(false)
    const { userId, token } = useParams()
    
    useEffect(() => {
        console.log('WE ARE HEREEEEE')
        const verifyEmail = async () => {
            try{
                const url = `http://localhost:5000/api/users/${userId}/verify/${token}`
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                setValidUrl(true)
            } catch(error){
                setValidUrl(false)
            }
            validUrl ? navigate('/login') : navigate('/register')
        }
        verifyEmail()
    }, [userId, token])
}

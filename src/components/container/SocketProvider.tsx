import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import { parsedEnv } from '@/env'
import { axiosIns as baseAxiosIns } from '@/hooks/useAxiosIns'
import cookies from '@/libs/cookies'
import useRefreshTokenFn from '@/hooks/useRefreshTokenFn'

type SocketProps = {
    socket: Socket | null
}

const SocketContext = createContext<SocketProps | null>(null)

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const getAccessToken = () => cookies.get('access_token_dash') || localStorage.getItem('access_token_dash')
    const getRefreshToken = () => cookies.get('refresh_token_dash') || localStorage.getItem('refresh_token_dash')
    const refreshTokenFn = useRefreshTokenFn(baseAxiosIns)

    useEffect(() => {
        const newSocket = io(parsedEnv.VITE_SERVER_URL, {
            withCredentials: true,
            reconnection: false,
            autoConnect: false,
            auth: { token: `Bearer ${getAccessToken()}` }
        })

        let isRetried = false
        newSocket.on('connect_error', async (err: any) => {
            if (err.message === 'INVALID_CREDENTIALS' && !isRetried) {
                isRetried = true
                try {
                    const refreshToken = getRefreshToken()
                    const token = await refreshTokenFn(refreshToken)
                    if (!token) throw new Error('REFRESH_TOKEN_FAILED')

                    newSocket.auth = { token: `Bearer ${token}` }
                    newSocket.connect()
                } catch (e) {
                    newSocket.disconnect()
                } finally {
                    isRetried = false
                }
            }
        })

        setSocket(newSocket)
        newSocket.connect()

        return () => {
            newSocket.removeAllListeners()
            newSocket.disconnect()
        }
    }, [])

    return <SocketContext.Provider value={{ socket: socket }}>{children}</SocketContext.Provider>
}

export const useSocketContext = () => {
    const context = useContext(SocketContext)
    if (!context) throw new Error('useSocketContext must be used within a SocketProvider')

    return context
}

import {host} from './common'
import socketIOClient from 'socket.io-client'

export const socket = socketIOClient(host);
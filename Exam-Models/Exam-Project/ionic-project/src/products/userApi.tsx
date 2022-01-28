import axios from 'axios';
import {authConfig, baseUrl, getLogger, withLogs} from '../core';
import {UserProps} from "./UserProps";

const usersUrl = `http://${baseUrl}/api/auth/users`;
const logOffUrl = `http://${baseUrl}/api/auth/logoff`;
const usernamesUrl = `http://${baseUrl}/api/auth/getUsernameById`;
const userStatusUrl = `http://${baseUrl}/api/auth/updateUserStatus`;

export const getUsers: (token: string) => Promise<UserProps[]> = token => {
    return withLogs(axios.get(usersUrl, authConfig(token)), 'getUsers');
}

export const updateUser: (token: string, user: UserProps) => Promise<UserProps[]> = (token, user) => {
    console.log("UPDATEUSER USER ID PARAMETER: ");
    console.log(user._id);
    console.log(user);
    return withLogs(axios.put(`${usersUrl}/${user._id}`, user, authConfig(token)), 'updateUser');
}

export const logOff: (token: string, userId: string) => Promise<any> = (token, userId) => {
    return withLogs(axios.post(logOffUrl, {id: userId}, authConfig(token)), 'logOff');
}

export const getUserId: (username: string, token: string) => Promise<any> = (username, token) => {
    return withLogs(axios.post(usersUrl, {username: username}, authConfig(token)), 'getUserId');
}

export const getUsernameById: (userId: string, token: string) => Promise<any> = (userId, token) => {
    return withLogs(axios.post(usernamesUrl, {userId: userId}, authConfig(token)), 'getUsernameById');
}

export const updateUserStatus: (userId: string, token: string, status: boolean) => Promise<any> = (userId, token, status) => {
    return withLogs(axios.post(userStatusUrl, {userId: userId, status: status}, authConfig(token)), 'updateUserStatus');
}

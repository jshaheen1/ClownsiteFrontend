import { jwtDecode } from 'jwt-decode';

export const getUserInfo = () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const role = decodedToken.role
            console.log(decodedToken);
            console.log(role);
            localStorage.setItem('userRole', role);
            return decodedToken;
        } catch (error) {
            console.error('Invalid token:', error);
            return null;
        }
    }
    return null;
};

export const getUserRole = () => {
    return localStorage.getItem('userRole');
};
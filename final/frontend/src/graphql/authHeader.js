export const authHeader = (token) => {
    return {
        context: {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    }
}
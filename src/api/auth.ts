
export const googleLogin = async (idToken: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/google`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Google login failed');
    }

    return data;
};

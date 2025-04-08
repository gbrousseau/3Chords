
export type UserType = {
    email: string;
    firstName?: string;
    id: string;
    lastName?: string;
    profilePic_url?: string;
    subscription?: string;
    type?: string;
    services?: string[];
    introduction?: string;
    description?: string;
}

export type Goal = {
    id: string;
    title: string;
    description: string;
    deadline: string;
    service: string;
    type: 'short-term' | 'long-term';
    completed: boolean;
}
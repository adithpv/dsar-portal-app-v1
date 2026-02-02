export type AdminRequest = {
    id: string;
    requester_name: string;
    requester_email: string;
    created_at: string;
    status: string;
    request_type: string;
    companies: {
        name: string;
    };
};

export type AuditLog = {
    id: string;
    changed_at: string;
    old_status: string;
    new_status: string;
    dsar_requests: {
        requester_email: string;
    } | null;
    profiles: {
        role: string;
        email: string;
    } | null;
};

export type AuthState = {
    error?: string;
    success?: boolean;
};

export type CompanyRequest = {
    id: string;
    requester_name: string;
    requester_email: string;
    requester_phone: string | null;
    created_at: string;
    request_type: string;
    status: string;
};

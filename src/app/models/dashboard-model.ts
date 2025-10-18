export interface DashboardModel {
    documents: [DocumentMeta]
}

export interface DocumentMeta {
    file_name: string;
    document_id: string;
    is_tax_related?: boolean;
    due_date?: string;
    is_payment?: number;
}
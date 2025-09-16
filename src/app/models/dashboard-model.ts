export interface DashboardModel {
    documents: [DocumentMeta]
}

export interface DocumentMeta {
    file_name: string;
    document_id: string;
}
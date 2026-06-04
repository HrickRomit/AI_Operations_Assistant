from pydantic import BaseModel


class DashboardStats(BaseModel):
    documents_uploaded: int
    queries_made: int
    leads_captured: int

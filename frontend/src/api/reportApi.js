import api from './axiosConfig'

export const getAllReports = () => api.get('/api/reports')
export const getMyReports = () => api.get('/api/reports/mine')
export const createReport = (data, photo) => {
  const formData = new FormData()
  formData.append('licensePlate', data.licensePlate)
  formData.append('violationType', data.violationType)
  formData.append('locationAddress', data.locationAddress)
  formData.append('locationLatitude', data.locationLatitude)
  formData.append('locationLongitude', data.locationLongitude)
  if (data.description) formData.append('description', data.description)
  if (photo) formData.append('photo', photo)

  return api.post('/api/reports', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
export const updateReportStatus = (reportId, status) =>
api.patch(`/api/reports/${reportId}/status`, { status })

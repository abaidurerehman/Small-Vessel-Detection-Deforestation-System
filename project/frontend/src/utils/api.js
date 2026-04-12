import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const TOKEN    = import.meta.env.VITE_API_TOKEN || 'supersecrettoken123';

const api = axios.create({
  baseURL: API_BASE,
  headers: { Authorization: `Bearer ${TOKEN}` },
  timeout: 120000,
});

api.interceptors.response.use(
  (r) => r,
  (err) => Promise.reject(new Error(
    err.response?.data?.detail || err.message || 'Unexpected error'
  ))
);

export const predictDeforestation = async (file, conf, iou, onProgress) => {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('confidence', conf);
  fd.append('iou', iou);
  const res = await api.post('/predict-deforestation', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress && onProgress(Math.round(e.loaded * 100 / e.total)),
  });
  return res.data;
};

export const predictVessel = async (file, conf, iou, onProgress) => {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('confidence', conf);
  fd.append('iou', iou);
  const res = await api.post('/predict-vessel', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress && onProgress(Math.round(e.loaded * 100 / e.total)),
  });
  return res.data;
};

export const checkHealth = async () => (await api.get('/health')).data;

export default api;

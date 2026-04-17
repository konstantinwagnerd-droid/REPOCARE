import { useQuery } from '@tanstack/react-query';
import { api } from '@lib/api';
import { MOCK_RESIDENTS, MOCK_REPORTS, MOCK_VITALS, MOCK_MEDICATIONS, type Resident, type Report } from '@lib/mock-data';

export function useResidents() {
  return useQuery({
    queryKey: ['residents'],
    queryFn: () =>
      api.get<Resident[]>('/api/residents', {
        cacheKey: 'residents.list',
        mock: MOCK_RESIDENTS,
      }),
    staleTime: 60_000,
  });
}

export function useResident(id: string) {
  return useQuery({
    queryKey: ['resident', id],
    queryFn: () =>
      api.get<Resident>(`/api/residents/${id}`, {
        cacheKey: `resident.${id}`,
        mock: MOCK_RESIDENTS.find((r) => r.id === id),
      }),
    enabled: !!id,
  });
}

export function useResidentReports(id: string) {
  return useQuery({
    queryKey: ['resident-reports', id],
    queryFn: () =>
      api.get<Report[]>(`/api/residents/${id}/reports`, {
        cacheKey: `resident.${id}.reports`,
        mock: MOCK_REPORTS.filter((r) => r.residentId === id),
      }),
    enabled: !!id,
  });
}

export function useResidentVitals(id: string) {
  return useQuery({
    queryKey: ['resident-vitals', id],
    queryFn: () =>
      api.get(`/api/residents/${id}/vitals`, {
        cacheKey: `resident.${id}.vitals`,
        mock: MOCK_VITALS[id] ?? { hr: [], bp: [], temp: [] },
      }),
    enabled: !!id,
  });
}

export function useResidentMedications(id: string) {
  return useQuery({
    queryKey: ['resident-medications', id],
    queryFn: () =>
      api.get(`/api/residents/${id}/medications`, {
        cacheKey: `resident.${id}.medications`,
        mock: MOCK_MEDICATIONS.filter((m) => m.residentId === id),
      }),
    enabled: !!id,
  });
}

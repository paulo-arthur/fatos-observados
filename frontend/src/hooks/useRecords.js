import useResource from './useResource.js';

export default function useRecords() {
  const fos = useResource('/fos');
  const students = useResource('/students');
  const instructors = useResource('/instructors');
  return {
    fos: fos.data || [],
    students: students.data || [],
    instructors: instructors.data || [],
    loading: fos.loading || students.loading || instructors.loading,
    error: fos.error || students.error || instructors.error,
    reload() { fos.reload(); students.reload(); instructors.reload(); },
  };
}

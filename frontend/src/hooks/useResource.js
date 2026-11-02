import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/axios.js';
import { errorMessage } from '../utils/format.js';

export default function useResource(path) {
  const [state, setState] = useState({ data: null, request: null, error: '' });
  const [revision, setRevision] = useState(0);
  const request = `${path}:${revision}`;
  const reload = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    api.get(path, { signal: controller.signal }).then(({ data }) => {
      setState({ data, request, error: '' });
    }).catch((error) => {
      if (!controller.signal.aborted) setState({ data: null, request, error: errorMessage(error) });
    });
    return () => controller.abort();
  }, [path, request]);

  return { ...state, loading: state.request !== request, reload };
}

import { useState, useEffect } from 'react';
import { Stats } from '../lib/prices';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"

export function useCommunes() {
    const [communes, setCommunes] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/communes`)
            .then((response) => response.json())
            .then(data => {
                setCommunes(data.communes);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return { communes, loading };
}

export function useCompare(selected: string[]): { data: Stats[]; loading: boolean } {
    const [data, setData] = useState<Stats[]>([]);
    const [loadedKey, setLoadedKey] = useState('');
    const key = selected.join(',');

    useEffect(() => {
        if (!key) return;
        const controller = new AbortController();
        fetch(`${API_URL}/compare?communes=${key}`, { signal: controller.signal })
            .then((response) => response.json())
            .then(result => {
                setData(result.result);
                setLoadedKey(key);
            })
            .catch(() => {});
        return () => controller.abort();
    }, [key]);

    const loading = key !== '' && loadedKey !== key;
    return { data: key ? data : [], loading };
}

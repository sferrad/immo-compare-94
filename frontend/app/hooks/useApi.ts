import { useState, useEffect } from 'react';

const API_URL = "http://localhost:8001"

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
    }, []);

    return { communes, loading };
}

export function useCompare(selected: string[]) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selected.length === 0) return;
        setLoading(true);
        fetch(`${API_URL}/compare?communes=${selected.join(',')}`)
            .then((response) => response.json())
            .then(data => {
                setData(data.result);
                setLoading(false);
            })
    }, [selected]);

    return { data, loading };
}
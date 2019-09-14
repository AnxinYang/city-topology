type transport = 'land' | 'air' | 'inter-state';

interface state {
    name: string,
    cities: string[],
    reachable_cities: reachable_city[],
    reachable_states: string[],
    type?: 'state',
    x?: number,
    y?: number,
}
interface city {
    name: string,
    state: string,
    reachable_cities: reachable_city[],
    type?: 'city',
    x?: number,
    y?: number,
}
interface reachable_city {
    name: string,
    state: string,
    transport: transport,
}
interface link {
    source: city | state,
    target: city | state,
    transport: transport,
    distance: number,
}

export { state, city, reachable_city, link, transport }
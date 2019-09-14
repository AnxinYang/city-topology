import { state, city, link } from './definitions';

let store = new Map();
let state_array: state[] = [];


function getCity(name: string) {
    return store.get(name + '_city');
}
function getState(name: string) {
    return store.get(name + '_state');
}
function storeCity(city: city) {
    let c: city = { ...city, type: 'city' };
    store.set(c.name + '_city', c);
    return c;
}

function storeState(city: city) {
    let state: state = getState(city.state);
    if (!state) {
        state = {
            name: city.state,
            cities: [],
            reachable_cities: [],
            reachable_states: [],
            type: 'state'
        }
        store.set(state.name + '_state', state);
        state_array.push(state);
    }
    state.reachable_cities = [...city.reachable_cities.filter(reachable_city => reachable_city.state !== city.state), ...state.reachable_cities]
    state.reachable_cities.forEach(reachable_city => {
        if (state.reachable_states.indexOf(reachable_city.state) < 0) {
            state.reachable_states.push(reachable_city.state);
        }
    })
    state.cities.push(city.name);
    return state;
}

function storeCitiesAndStates(cities: city[]) {
    cities.forEach((city) => {
        storeCity(city);
        storeState(city);
    })
}

function createTopologyData(states: state[], expandedState?: state) {
    let link_array: link[] = [];
    let displayedCity_array: city[] = [];
    let displayedCity_map: any = {};
    let displayedState_array: state[] = [];
    let node_array: (city | state)[];

    if (expandedState) {
        expandedState.cities.forEach((cityName) => {
            let city: city = getCity(cityName);

            city.reachable_cities.forEach((reachable_city) => {
                let isSameState = reachable_city.state === city.state;
                let link: link = {
                    source: city,
                    target: isSameState ? getCity(reachable_city.name) : getState(reachable_city.state),
                    transport: isSameState ? reachable_city.transport : 'inter-state',
                    distance: isSameState ? 30 : 60
                };
                if (link.source && link.target)
                    link_array.push(link);
            });

            displayedCity_map[cityName] = true;
            // delete city.x;
            // delete city.y;
            displayedCity_array.push(city);
        });

    }

    states.forEach(state => {
        if (state === expandedState) return;
        let cities: city[] = [];
        state.reachable_cities.forEach(reachable_city => {
            if (displayedCity_map[reachable_city.name]) {
                let link: link = {
                    source: state,
                    target: getCity(reachable_city.name),
                    transport: 'inter-state',
                    distance: 60
                };
                if (link.source && link.target)
                    link_array.push(link);
            }
        });
        state.reachable_states.forEach(reachable_state => {
            let s = getState(reachable_state)
            if (s === expandedState) return;
            let link: link = {
                source: state,
                target: s,
                transport: 'inter-state',
                distance: 60
            };
            if (link.source && link.target)
                link_array.push(link);

        })
        displayedState_array.push(state);
        //delete state.x;
        // delete state.y;
    })

    node_array = [...displayedCity_array, ...displayedState_array];

    return { nodes: node_array, links: link_array };
}

export default store;
export {
    storeCity,
    storeState,
    storeCitiesAndStates,
    state_array,
    createTopologyData,
    getState,
    getCity,
}
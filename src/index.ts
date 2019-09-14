import cc, { ccd3 as d3 } from 'ccts';
import { link } from 'fs';
import { line } from 'd3';

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
const cities: city[] = [
    {

        "name": "San Jose",
        "state": "CA",
        "reachable_cities": [
            {
                "name": "Mountain View", "state": "CA", "transport": "land"
            }, {
                "name": "New York City", "state": "NY", "transport": "air"
            }]
    }, {

        "name": "Mountain View",
        "state": "CA"
        , "reachable_cities": [
            {
                "name": "San Jose", "state": "CA", "transport": "land"
            }]
    }, {

        "name": "New York City",
        "state": "NY",
        "reachable_cities": [
            {
                "name": "San Jose", "state": "CA", "transport": "air"
            }]
    }];

const circle_size = {
    city: 16,
    state: 32,
}

let store = new Map();
let state_array: state[] = [];

let storeCity = (city: city) => {
    let c: city = { ...city, type: 'city' };
    store.set(c.name, c);
    return c;
}

let storeState = (city: city) => {
    let state: state = store.get(city.state);
    if (!state) {
        state = {
            name: city.state,
            cities: [city.name],
            reachable_cities: city.reachable_cities.filter(reachable_city => reachable_city.state !== city.state),
            reachable_states: [],
            type: 'state'
        }

        state.reachable_cities.forEach(reachable_city => {
            if (state.reachable_states.indexOf(reachable_city.state) < 0) {
                state.reachable_states.push(reachable_city.state);
            }
        })
        store.set(state.name, state);
        state_array.push(state);
    } else {
        state.cities.push(city.name);
    }
    return state;
}

let storeCitiesAndStates = (cities: city[]) => {
    cities.forEach((city) => {
        storeCity(city);
        storeState(city);
    })
}

storeCitiesAndStates(cities)
console.log(store)

let createTopologyData = (states: state[], expandedState?: state) => {
    let link_array: link[] = [];
    let displayedCity_array: city[] = [];
    let displayedCity_map: any = {};
    let displayedState_array: state[] = [];
    let node_array: (city | state)[];

    if (expandedState) {
        expandedState.cities.forEach((cityName) => {
            let city: city = store.get(cityName);

            city.reachable_cities.forEach((reachable_city) => {
                let isSameState = reachable_city.state === city.state;
                let link: link = {
                    source: city,
                    target: store.get(isSameState ? reachable_city.name : reachable_city.state),
                    transport: isSameState ? reachable_city.transport : 'inter-state',
                    distance: isSameState ? 30 : 60
                };
                link_array.push(link);
            });

            displayedCity_map[cityName] = true;
            delete city.x;
            delete city.y;
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
                    target: store.get(reachable_city.name),
                    transport: 'inter-state',
                    distance: 60
                };
                link_array.push(link);
            }
        });
        state.reachable_states.forEach(reachable_state => {
            let s = store.get(reachable_state)
            if (s === expandedState) return;
            let link: link = {
                source: state,
                target: store.get(s),
                transport: 'inter-state',
                distance: 60
            };
            link_array.push(link);

        })
        displayedState_array.push(state);
        delete state.x;
        delete state.y;
    })

    node_array = [...displayedCity_array, ...displayedState_array];

    return { nodes: node_array, links: link_array };
}

render(store.get('CA'))


function render(expandedState?: state) {
    let topologyData = createTopologyData(state_array, expandedState);
    console.log(topologyData);
    let { nodes, links } = topologyData;


    let width = 500, height = 500;

    let linkForce = d3.forceLink().distance((d: any) => {
        return d.distance;
    })
        .strength(0).links(links);

    let simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody().strength(-30))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('link', linkForce)
        .on('tick', ticked);

    d3.select('.links')
        .selectAll('line')
        .data(links)
        .exit()
        .remove();

    d3.select('.links')
        .selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('stroke', '#6ab04c')
        .attr('stroke-width', '2px');

    let lines = d3.selectAll('.links line')


    d3.select('.nodes')
        .selectAll('g')
        .data(nodes)
        .exit()
        .remove();

    d3.select('.nodes')
        .selectAll('g')
        .data(nodes)
        .enter()
        .append('g')
        .append('circle')
        .attr('fill', '#f9ca24')
        .parent()
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('stroke', 'black')
        .attr('dy', 5);

    let circles = d3.selectAll('.nodes g')
        .on('click', function (d: (city | state)) {
            if (d.type === 'state') {
                render(d)
            }
        })
        .select('circle')
        .attr('r', function (d: (city | state)) {
            return circle_size[d.type];
        })
        .parent()
        .select('text')
        .text(function (d: (city | state)) {
            return d.name
        })
        .parent();


    function updateLinks() {
        lines.attr('x1', function (d: link) {
            return d.source.x
        })
            .attr('y1', function (d: link) {
                return d.source.y
            })
            .attr('x2', function (d: link) {
                return d.target.x
            })
            .attr('y2', function (d: link) {
                return d.target.y
            });


    }

    function updateNodes() {
        circles.attr('transform', (d: (city | state)) => {
            return `translate(${d.x},${d.y})`
        })
    }

    function ticked() {
        updateLinks()
        updateNodes()
    }
}
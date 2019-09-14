import { ccd3 as d3 } from 'ccts';
import { createTopologyData, state_array } from './store';
import { state, city, link } from './definitions';
const circle_size = {
    city: 16,
    state: 32,
}

let svg = d3.select('svg')
let linkForce = d3.forceLink().distance((d: any) => {
    return d.distance;
}).strength(0);
let charge = d3.forceManyBody().strength(-30);

export default function render(expandedState?: state) {
    let topologyData = createTopologyData(state_array, expandedState);
    console.log(topologyData);
    let { nodes, links } = topologyData;


    let width = window.innerWidth - 50, height = window.innerHeight - 50;

    svg.attr('height', height)
        .attr('width', width);
    linkForce.links(links);

    let simulation = d3.forceSimulation(nodes)
        .force('charge', charge)
        .force('x', d3.forceX().x(function (d: (city | state)) {
            return d.type === 'state' ? width * 0.66 : width * 0.33;
        }).strength(0.02))
        .force('y', d3.forceY().y(height / 2).strength(0.02))
        .force('collision', d3.forceCollide().radius(function (d: (city | state)) {
            return circle_size[d.type];
        }))
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
};
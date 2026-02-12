import * as d3 from "d3";
import { NodePieBuilder } from "./nodePie";
import { tooltip_in, tooltip_out, tooltip_move } from "./tooltip";


const duration = 1000;
const nodeSize = 20;
const markerSize = 8;
const minHeightSeparator = 120;

let root;
let tree;
let diagonal;
let sameDepthDiagonal;
let lastClicked;
let zoom;
let lastExpanded
let additionalLinks = [];

let innerCache = new Set();

export const setsIntersection = (set1, set2)  => {
  const intersection = new Set([...set1].filter(element => set2.has(element)));
  return intersection;
 };

 // this function changes the node and link dataset to a tree for d3 hierarchy to work
export const parseToTree = (dataset) => {
  const usedNodes = []
  const usedLinks = []
  const missing = []
  let nodequeue = []

  // get map to store data.
  const map = new Map(dataset.nodes.map(o => [o.id, {...o,  children: []}]));

  // select the rootnode.
  const rootnode = dataset.links.filter((n) => 
    n.source === 0
  );
  if (rootnode) {
    nodequeue.push(...rootnode)
    usedLinks.push(...rootnode)
  }

  while (nodequeue.length) {
    const auxnodequeue = []
    for (let link of nodequeue){
      if (usedNodes.includes(link.target)) {
          missing.push(link)
      } else {
          map.get(link.source).children.push(map.get(link.target));
          usedNodes.push(link.target)
      } 
      const children = dataset.links.filter((n) => n.source === link.target && !usedLinks.find((l) => l.source === n.source && l.target === n.target) )
      auxnodequeue.push(...children)
      usedLinks.push(...children)
    }
    nodequeue = auxnodequeue;
  }
  
  return {
      tree: map.get(0),
      missing: missing,
  };
};

/**
 first render of the tree, set viz elements only once
 */
export const initTree = (treeData, missing, funcs) => {

  const treeWidth = funcs.width * 0.95;
  const treeHeight = funcs.height * 0.95;
  
  // additional links data array
  innerCache = new Set([...funcs.clickedCache]);
  additionalLinks = []
  
  tree = d3.tree()
    .nodeSize([2.5*nodeSize, 2*nodeSize])
  funcs.setTree(() => tree);

  diagonal = d3.linkVertical().x(d => d.x ).y(d => d.y )
  sameDepthDiagonal = d3.line()
  .x((d) => d.x)
  .y((d) => d.y)
  .curve(d3.curveBasis);

  
  // // change the root of the hierarchy tree for the new one
  root = d3.hierarchy(treeData);
  root.x0 = funcs.width / 2;
  root.y0 = 0;
  funcs.setRoot(() => root);

  // zoom
  const handleZoom = (e) => {
    d3.select("#general")
		.attr('transform', e.transform);

    d3.select(".custom-menu")
      .style("display", "none")
    d3.select(".custom-menu-test")
    .style("display", "none")
    d3.select(".remove-menu-test")
    .style("display", "none")
  }

  zoom = d3.zoom()
    .on('zoom', handleZoom)
    .scaleExtent([.5, 2])


  // select base svg
  const svg = d3.select(funcs.svgRef.current)

  svg
    .attr("width", `90%`)
    .attr("height", `${treeHeight}px`)
    .attr("viewBox", `0 0 ${treeWidth} ${treeHeight}`)
    .attr("style", "font: 10px sans-serif; user-select: none");
    
  svg.call(zoom)

  // zoomin and zoomout
  d3.select("#zoominButton")
    .on("click", () => {
      svg
        .transition()
        .call(zoom.scaleBy, 1.3);
      
      d3.select(".custom-menu")
      .style("display", "none")

      d3.select(".custom-menu-test")
      .style("display", "none")

      d3.select(".remove-menu-test")
      .style("display", "none")
    })
  
  d3.select("#zoomoutButton")
    .on("click", () => {
      svg
        .transition()
        .call(zoom.scaleBy, 0.7);
      
      d3.select(".custom-menu")
      .style("display", "none")
      d3.select(".custom-menu-test")
      .style("display", "none")
      d3.select(".remove-menu-test")
      .style("display", "none")
    })
  
  // generate array with missing links (cycles)
  missing.forEach((link) => {
    // fill additionalLinks array
    let pairNode1 = root.descendants().filter(function(d) {
        return d.data.id === link.source;
    })[0];
    let pairNode2 = root.descendants().filter(function(d) {
        return d.data.id === link.target;
    })[0];
    const linkaux = new Object();
    linkaux.source = pairNode1;
    linkaux.target = pairNode2;

    additionalLinks.push(linkaux)
})

  if (!d3.select("#general").size()) {
    svg
    .append("g")
    .attr('transform','translate('+ (treeWidth/2) +', 0)')
    .append("g")
    .attr("id", "general")

    d3.select("#general").append("g").attr("id", "linkGroup");
    d3.select("#general").append("g").attr("id", "nodeGroup");

    // arrows
    svg.append('svg:defs').append('svg:marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', markerSize)
      .attr('markerWidth', markerSize)
      .attr('markerHeight', markerSize)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#000');

      svg.append('svg:defs').append('svg:marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', markerSize)
      .attr('markerWidth', markerSize)
      .attr('markerHeight', markerSize)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#000');
  }
  // // call to update and visualize
  updateTree(root, additionalLinks, funcs);
  // add a eventlistener
  d3.select("body").on("click", (event) => {
    if (event.target.className !== "menu-item" && event.target.className.baseVal !== "menuButton") {
      d3.select(".custom-menu")
        .style("display", "none")
      d3.select(".custom-menu-test")
      .style("display", "none")
      d3.select(".remove-menu-test")
      .style("display", "none")
      if (event.target.tagName !== "circle") {
        restoreHighlight();
      }
    }
  })
}

export const updateTree = (source, additionalLinks, funcs) => {
    let nodes = root.descendants()
    let links = root.links();

    tree(root);
    nodes.forEach((d) =>  { d.y = d.depth * minHeightSeparator; });

    lastExpanded = funcs.lastExpanded;
    
    
    // select base svg
    const svgLinkGroup = d3.select("#linkGroup")
    const svgNodeGroup = d3.select("#nodeGroup")

    
    // // ======== add links ========
    let link = svgLinkGroup.selectAll("path.originalLink")
        .data(links, function (d) {  return `${d.source.data.id}+${d.target.data.id}`; });

    const linkEnter = link.enter().append("path")
        .attr("class", "link originalLink")
        .classed("highlightedGraph", !lastClicked)
        .classed("notHighlightedGraph", lastClicked)
        .attr('marker-end', 'url(#arrow)')
        .style("stroke", "gray")
        .attr("d", d => {
          const o = lastExpanded ? {x: lastExpanded.x , y: lastExpanded.y} : {x: root.x0 , y: root.y0};
          return diagonal({source: o, target: o});
        });

    // // Transition links to their new position.
    link.merge(linkEnter).transition()
      .duration(duration)
      .attr("d", d => {
        const o = { source: {x: d.source.x, y: d.source.y}, target: { x: d.target.x, y: d.target.y - nodeSize } }
        return diagonal(o);
      });

    link.exit().transition()
        .duration(duration)
        .attr("d", function (d) {
            let o = lastExpanded ? { x: lastExpanded.x, y: lastExpanded.y } 
            : { x: root.x0, y: root.y0 } ;
            return diagonal({ source: o, target: o });
        })
        .remove();

    // ======== add additional links (mpLinks) ========
    let mpLink = svgLinkGroup.selectAll("path.mpLink")
        .data(additionalLinks,  function (d) { return `${d.source.data.id}+${d.target.data.id}`; });

    const mplinkEnter = mpLink.enter().append("path")
        .attr("class", "link mpLink")
        .classed("highlightedGraph", !lastClicked)
        .classed("notHighlightedGraph", lastClicked)
        .attr('marker-end', 'url(#arrow)')
        .attr("x", nodeSize )
        .attr("y", nodeSize )
        .style("stroke", (d) => "gray")
    .attr("d", d => {
      const o = lastExpanded ? {x: lastExpanded.x , y: lastExpanded.y} : {x: root.x0 , y: root.y0};
      return diagonal({source: o, target: o});
    });

    // // Transition links to their new position.
    mpLink.merge(mplinkEnter).transition()
      .duration(duration)
      .attr("d", d => {
        const o = { source: {x: d.source.x, y: d.source.y}, target: { x: d.target.x, y: d.target.y } }
        if (d.source.depth !== d.target.depth) {
          o.target.y = d.source.depth < d.target.depth ? o.target.y - nodeSize : o.target.y + nodeSize;
          return diagonal(o);
        }
        const points = [
          { x: o.source.x, y: o.source.y + nodeSize },
          { x: o.target.x, y: o.target.y + nodeSize + (minHeightSeparator * 0.8) },
          { x: o.target.x, y: o.target.y + nodeSize }
        ]
        return sameDepthDiagonal(points);
      });

    mpLink.exit().transition()
        .duration(duration)
        .attr("d", function (d) {
          const o = {x: d.source.x, y: d.source.y};
            return diagonal({ source: o, target: o });
        })
        .remove();

        nodes.forEach(function (d) {
          d.x0 = d.x;
          d.y0 = d.y;
      });
    
    // ======== add nodes and text elements ========

    let node = svgNodeGroup.selectAll("g.node")
        .data(nodes, function (d) { return +d.data.id });

    let nodeEnter = node.enter().append("g")
        .attr("id", (d) => "node"+d.data.id)
        .attr("class", "node")
        .classed("highlightedGraph", !lastClicked)
        .classed("notHighlightedGraph", lastClicked)
        .attr("transform", function (d) { return d.data.id !== 0 && lastExpanded ? `translate(${lastExpanded.x},${lastExpanded.y})` : `translate(${root.x0},${root.y0})`; })



    const colors = funcs.colorData;
    node.merge(nodeEnter).each(function (d) {
      NodePieBuilder.drawNodePie(d3.select(this), d.data.id && colors[d.data.id], {
          radius: nodeSize,
          parentNodeColor: 'pink',
          outerStrokeWidth: 12,
          showLabelText: true,
          labelText: d.data.type || '',
          labelColor: 'pink',
          innerColor: 'pink',
          padding: nodeSize,
          onPieClick: (e, d) => pieClick(e, d, funcs),
          onMouseOver: (e, d, percentage) => tooltip_in(e, d, percentage),
          onMouseMove: (e, d) => tooltip_move(e, d),
          onMouseOut: (e, d) => tooltip_out(e, d),

      })
    }); 

    let nodeUpdate = node.merge(nodeEnter)
        .transition()
        .duration(duration)
        .attr("transform", function (d) { return `translate(${d.x},${d.y})`; });

    nodeUpdate.each(function (d) {
      const possiblechildren = funcs.originalDataset.links.filter((l) => l.source === d.data.id);

      if (!possiblechildren.length || d.data.id === 0) return;

      const openLink = links.filter((l) => l.source.data.id === d.data.id)
      const openAdditionalLink = additionalLinks.filter((l) => l.source.data.id === d.data.id)
      
      const openIcon = openLink.length || openAdditionalLink.length;
      NodePieBuilder.drawPlusButton(d3.select(this), {
        radius: nodeSize,
        openIcon: openIcon,
        onClick: (e,d) => click(e,d, funcs),
        onFullClick: (e,d) => fullClick(e,d, funcs),
        onRemove: (e, d) => remove(e, d, funcs),
      })  
    }); 

    node.exit().transition()
        .duration(duration)
        .attr("transform", function (d) { return d.data.id !== 0 && lastExpanded ? `translate(${lastExpanded.x},${lastExpanded.y})` : `translate(${root.x0},${root.y0})`; })
        .remove();
    
        
    node = svgNodeGroup.selectAll("g.node")
    
    // Update zoom and pan

    const container = d3.select('#general').node();
    const dimensions = container.getBoundingClientRect();
    zoom
      .extent([
        [0, 0],
        [dimensions.width, dimensions.height]
      ])
      .translateExtent([
        [0-dimensions.width*1, 0-dimensions.height*1],
        [dimensions.width + dimensions.width*1,dimensions.height + dimensions.height*1]
      ])

      // restore colors if needed
      if (!funcs.lastClickedPresent) restoreHighlight();
}

export const pieClick = (e, d, funcs) => {
  // If im untoggling
  if (
    lastClicked &&
    lastClicked.data.id === d.data.id) {

    d3.selectAll(".notHighlightedGraph")
    .classed('highlighted', true)
    .classed('notHighlightedGraph', false);

    lastClicked = null;
    funcs.setLastClicked(null);
    funcs.setLastClickedPresent(false);

    return;
  }

  // if im highlighting

  funcs.setLastClickedPresent(true);
  funcs.setLastClicked(d);
  lastClicked = d;

  // // for the highlighter

  // all the highlights are false.
  d3.selectAll(".highlightedGraph")
    .classed('highlighted', false)
    .classed('notHighlightedGraph', true);

  const highlightIds = [];
  const currentChecking = [d];

  while (currentChecking.length) {
    
    const actual = currentChecking.shift();

    if (
      !highlightIds.includes(actual.data.id)
    ) { 
      // Add current id
      highlightIds.push(actual.data.id);

      // If parent ADD
      if (actual.parent) currentChecking.push(actual.parent);

      // Check if in auxiliary nodes theres additional parents
      const additionalParent = additionalLinks
        .filter((l) => {return l.target.data.id === actual.data.id})
        .map((l) => l.source);

      currentChecking.push(...additionalParent);
    }
  }
  const nodes = d3.selectAll("g.node")
  nodes
    .classed("highlighted", (d) => highlightIds.includes(d.data.id))
    .classed('notHighlightedGraph', (d) => !highlightIds.includes(d.data.id));
  
  const links = d3.selectAll("path.originalLink")
  links
    .classed("highlighted", (d) =>  highlightIds.includes(d.source.data.id) && highlightIds.includes(d.target.data.id))
    .classed('notHighlightedGraph', (d) => !(highlightIds.includes(d.source.data.id) && highlightIds.includes(d.target.data.id)))

  const mplinks = d3.selectAll("path.mpLink")
  mplinks
    .classed("highlighted", (d) =>  highlightIds.includes(d.source.data.id) && highlightIds.includes(d.target.data.id))
    .classed('notHighlightedGraph', (d) => !(highlightIds.includes(d.source.data.id) && highlightIds.includes(d.target.data.id)))
}

export const click = (e, d, funcs) => {
 lastExpanded = d;
 

 // Log of previously clicked nodes to maintain ref    
 if (!innerCache.has(d.data.id)) 
 {
  innerCache.add(d.data.id)
 } else {
  innerCache.delete(d.data.id)
 }
 funcs.setClickedCache(innerCache);
 funcs.setLastExpanded(d);
 funcs.setAllClicked(false);
};

export const fullClick = (e, d, funcs) => {
  lastExpanded = d;
  
 
  // Log of previously clicked nodes to maintain ref    
  if (!innerCache.has(d.data.id)) 
  {
    const toAdd = funcs.clickFullPath(d.data);
    toAdd.forEach((d) => innerCache.add(d));
  } else {
    innerCache.delete(d.data.id)
  }
  funcs.setClickedCache(innerCache);
  funcs.setLastExpanded(d);
 };

 export const remove = (e, d, funcs) => {
   funcs.removeTest(d);
 };

 export const restoreHighlight = () => {
  d3.selectAll(".node")
  .classed('highlighted', true)
  .classed('notHighlightedGraph', false);


  d3.selectAll(".link")
  .classed('highlighted', true)
  .classed('notHighlightedGraph', false);
 }
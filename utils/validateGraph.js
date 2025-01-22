// utils/validateGraph.js
const validateGraph = (nodes, edges) => {
    const nodeIds = new Set(nodes.map(node => node.id));
  
    // Check if all edge references exist
    for (const edge of edges) {
      if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
        return { valid: false, message: 'Edge references invalid nodes' };
      }
    }
  
    // Optional: Check for cycles using DFS
    const adjList = {};
    nodes.forEach(node => { adjList[node.id] = []; });
    edges.forEach(edge => { adjList[edge.source].push(edge.target); });
  
    const visited = {};
    const recStack = {};
  
    const isCyclicUtil = (node) => {
      if (!visited[node]) {
        visited[node] = true;
        recStack[node] = true;
  
        for (const neighbor of adjList[node]) {
          if (!visited[neighbor] && isCyclicUtil(neighbor)) {
            return true;
          } else if (recStack[neighbor]) {
            return true;
          }
        }
      }
      recStack[node] = false;
      return false;
    };
  
    for (const node of nodeIds) {
      if (isCyclicUtil(node)) {
        return { valid: false, message: 'Graph contains a cycle' };
      }
    }
  
    return { valid: true };
  };
  
  module.exports = validateGraph;
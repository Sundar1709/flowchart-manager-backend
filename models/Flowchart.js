const mongoose = require('mongoose');

const NodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },

});

const EdgeSchema = new mongoose.Schema({
  source: { type: String, required: true },
  target: { type: String, required: true },
});

const FlowchartSchema = new mongoose.Schema({
  _id: {type: Number, required: true},
  name: { type: String, required: true },
  nodes: [NodeSchema],
  edges: [EdgeSchema],
}, { timestamps: true });

module.exports = mongoose.model('Flowchart', FlowchartSchema);
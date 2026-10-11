/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TCMGraphData, TCMNode, TCMRelation, OrganizationDimension, Graph3DLayout, PresetBook, TCMCategory } from './types/tcm';
import { PRESET_BOOKS } from './data/presetBooks';
import { Header } from './components/Header';
import { TCMGraph3D } from './components/TCMGraph3D';
import { TCMGraph2D } from './components/TCMGraph2D';
import { KnowledgeOrganizationBar } from './components/KnowledgeOrganizationBar';
import { NodeDetailPanel } from './components/NodeDetailPanel';
import { NodeComparisonPanel } from './components/NodeComparisonPanel';
import { CategoryLegend } from './components/CategoryLegend';
import { ImportBookModal } from './components/ImportBookModal';
import { PathTracerModal } from './components/PathTracerModal';
import { ExportModal } from './components/ExportModal';
import { MeridianViewer3D } from './components/MeridianViewer3D';

export default function App() {
  // Current loaded TCM Graph Data
  const [graphData, setGraphData] = useState<TCMGraphData>(PRESET_BOOKS[0].graphData);

  // Knowledge Organization Dimension: 'all' | 'classification' | 'thematic' | 'relational'
  const [dimension, setDimension] = useState<OrganizationDimension>('all');

  // 3D Layout: 'force' | 'sphere_classification' | 'thematic_rings' | 'meridian_cube'
  const [layout, setLayout] = useState<Graph3DLayout>('force');

  // View Mode: 3D knowledge graph canvas, 2D matrix, or 3D human body meridian circulation
  const [viewMode, setViewMode] = useState<'3d' | '2d' | 'meridian'>('3d');

  // Selected Nodes: supports single node or 2 nodes for comparison (Ctrl/Cmd multi-selection)
  const [selectedNodes, setSelectedNodes] = useState<TCMNode[]>([]);
  const selectedNode = selectedNodes.length === 1 ? selectedNodes[0] : null;
  const selectedNodeIds = selectedNodes.map(n => n.id);

  // Quick Category Filter
  const [selectedCategory, setSelectedCategory] = useState<TCMCategory | null>(null);

  // Modals state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isPathTracerOpen, setIsPathTracerOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [pathTraceStartId, setPathTraceStartId] = useState<string | null>(null);

  // Highlighted path nodes (when Path Tracer is running)
  const [highlightedPathNodeIds, setHighlightedPathNodeIds] = useState<string[]>([]);

  // Apply filtered nodes if category is selected
  const displayedNodes = React.useMemo(() => {
    if (!selectedCategory) return graphData.nodes;
    return graphData.nodes.filter(n => n.category === selectedCategory);
  }, [graphData.nodes, selectedCategory]);

  // Handler for node selection (supports Ctrl/Cmd click multi-select)
  const handleSelectNode = (node: TCMNode | null, isMultiSelect = false) => {
    if (!node) {
      setSelectedNodes([]);
      return;
    }

    if (isMultiSelect) {
      setSelectedNodes(prev => {
        const exists = prev.some(n => n.id === node.id);
        if (exists) {
          return prev.filter(n => n.id !== node.id);
        }
        if (prev.length >= 2) {
          return [prev[0], node];
        }
        return [...prev, node];
      });
    } else {
      setSelectedNodes([node]);
    }
  };

  // Handler to load imported graph
  const handleApplyGraph = (newGraph: TCMGraphData) => {
    setGraphData(newGraph);
    setSelectedNodes([]);
    setHighlightedPathNodeIds([]);
    setSelectedCategory(null);
  };

  // Handler to load a preset book
  const handleSelectPreset = (book: PresetBook) => {
    setGraphData(book.graphData);
    setSelectedNodes([]);
    setHighlightedPathNodeIds([]);
    setSelectedCategory(null);
  };

  // Start Path Trace from a specific node
  const handleStartPathTrace = (nodeId: string) => {
    setPathTraceStartId(nodeId);
    setIsPathTracerOpen(true);
  };

  // Update current graph with AI inferred latent relations & nodes
  const handleUpdateGraphWithInference = (
    newRelations: TCMRelation[],
    newNodes?: TCMNode[],
    _summary?: string
  ) => {
    setGraphData(prev => {
      // Merge new nodes
      const updatedNodes = [...prev.nodes];
      if (newNodes && newNodes.length > 0) {
        newNodes.forEach(node => {
          if (!updatedNodes.some(n => n.id === node.id || n.name === node.name)) {
            updatedNodes.push(node);
          }
        });
      }

      // Merge new relations avoiding duplicates
      const updatedRelations = [...prev.relations];
      newRelations.forEach(rel => {
        const exists = updatedRelations.some(
          r =>
            (r.source === rel.source && r.target === rel.target && r.relationType === rel.relationType) ||
            (r.source === rel.target && r.target === rel.source && r.relationType === rel.relationType)
        );
        if (!exists) {
          updatedRelations.push(rel);
        }
      });

      return {
        ...prev,
        nodes: updatedNodes,
        relations: updatedRelations,
      };
    });
  };

  // Update single node attributes
  const handleUpdateNode = (updatedNode: TCMNode) => {
    setGraphData(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => n.id === updatedNode.id ? updatedNode : n)
    }));
    setSelectedNodes(prev => prev.map(n => n.id === updatedNode.id ? updatedNode : n));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 flex flex-col">
      {/* Top Header Navigation */}
      <Header
        currentBookTitle={graphData.bookTitle}
        nodes={graphData.nodes}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenPathTracer={() => {
          setPathTraceStartId(selectedNodes.length > 0 ? selectedNodes[0].id : null);
          setIsPathTracerOpen(true);
        }}
        onSelectNode={(node) => setSelectedNodes([node])}
        onSelectPresetBook={handleSelectPreset}
        onExportGraph={() => setIsExportModalOpen(true)}
      />

      {/* Main Canvas Area */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {viewMode === 'meridian' ? (
          /* 3D Human Body Meridian Circulation & Acupoints */
          <MeridianViewer3D
            onImportToGraph={(acupointNode, relation) => {
              handleUpdateGraphWithInference(
                relation ? [relation] : [],
                [acupointNode],
                `已成功将腧穴【${acupointNode.name}】关联至中医知识图谱！`
              );
            }}
            onSelectNodeInGraph={(node) => {
              setViewMode('3d');
              setSelectedNodes([node]);
            }}
          />
        ) : viewMode === '3d' ? (
          <>
            {/* 3D Knowledge Graph WebGL Canvas */}
            <TCMGraph3D
              nodes={displayedNodes}
              relations={graphData.relations}
              dimension={dimension}
              layout={layout}
              selectedNodeId={selectedNode ? selectedNode.id : null}
              selectedNodeIds={selectedNodeIds}
              onSelectNode={handleSelectNode}
              highlightedPathNodeIds={highlightedPathNodeIds}
            />

            {/* Floating Knowledge Organization & 3D Layout Controls */}
            <KnowledgeOrganizationBar
              currentDimension={dimension}
              onChangeDimension={setDimension}
              currentLayout={layout}
              onChangeLayout={setLayout}
            />

            {/* Category Legend & Filter */}
            <CategoryLegend
              nodes={graphData.nodes}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </>
        ) : (
          /* 2D Knowledge Matrix / Hierarchy View */
          <TCMGraph2D
            nodes={displayedNodes}
            relations={graphData.relations}
            dimension={dimension}
            selectedNodeId={selectedNode ? selectedNode.id : null}
            onSelectNode={(node) => setSelectedNodes([node])}
          />
        )}

        {/* Dual Node Comparison Panel (when 2 nodes are selected via Ctrl/Cmd click) */}
        {selectedNodes.length === 2 && (
          <NodeComparisonPanel
            nodeA={selectedNodes[0]}
            nodeB={selectedNodes[1]}
            relations={graphData.relations}
            onClose={() => setSelectedNodes([])}
            onSelectSingleNode={(node) => setSelectedNodes([node])}
            onStartPathTrace={(startId, _endId) => {
              setPathTraceStartId(startId);
              setIsPathTracerOpen(true);
            }}
          />
        )}

        {/* Single Selected Node Details Card & TCM Clinical Deductions */}
        {selectedNodes.length === 1 && (
          <NodeDetailPanel
            node={selectedNodes[0]}
            allNodes={graphData.nodes}
            relations={graphData.relations}
            bookTitle={graphData.bookTitle}
            onClose={() => setSelectedNodes([])}
            onSelectNode={(node) => setSelectedNodes([node])}
            onStartPathTrace={handleStartPathTrace}
            onUpdateGraph={handleUpdateGraphWithInference}
            onUpdateNode={handleUpdateNode}
          />
        )}
      </main>

      {/* Import Book & AI Extraction Modal */}
      <ImportBookModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onApplyGraph={handleApplyGraph}
      />

      {/* TCM Clinical Reasoning Path Tracer Modal */}
      <PathTracerModal
        isOpen={isPathTracerOpen}
        onClose={() => setIsPathTracerOpen(false)}
        nodes={graphData.nodes}
        relations={graphData.relations}
        initialStartNodeId={pathTraceStartId}
        onHighlightPath={setHighlightedPathNodeIds}
        onSelectNode={(node) => setSelectedNodes([node])}
      />

      {/* Export Graph Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        graphData={graphData}
      />
    </div>
  );
}

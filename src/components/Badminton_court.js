"use client";
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const WIDTH = 670;
const HEIGHT = 610;
const MARGIN = 40;

const ProportionalRectangles = () => {
  const leftRef = useRef();
  const rightRef = useRef();

  const [leftPoints, setLeftPoints] = useState([]);
  const [rightPoints, setRightPoints] = useState([]);

  useEffect(() => {
    // === SVG GAUCHE ===
    const svgLeft = d3.select(leftRef.current)
      .attr("viewBox", `${-MARGIN} ${-MARGIN} ${WIDTH + MARGIN} ${HEIGHT + 2 * MARGIN}`)
      .style("width", "100%")
      .style("height", "auto")
      .style("aspectRatio", `${WIDTH} / ${HEIGHT}`)
      .style("cursor", "crosshair")
      .style("display", "block");

    svgLeft.selectAll("*").remove();

    svgLeft.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", WIDTH)
      .attr("height", HEIGHT)
      .attr("fill", "#90c29c");

    // lignes visibles pour simuler le padding
    svgLeft.append("line") // gauche
      .attr("x1", -MARGIN)
      .attr("y1", 0)
      .attr("x2", -MARGIN)
      .attr("y2", HEIGHT)
      .attr("stroke", "transparent");

    svgLeft.append("line") // haut
      .attr("x1", 0)
      .attr("y1", -MARGIN)
      .attr("x2", WIDTH)
      .attr("y2", -MARGIN)
      .attr("stroke", "transparent");

    svgLeft.append("line") // bas
      .attr("x1", 0)
      .attr("y1", HEIGHT + MARGIN)
      .attr("x2", WIDTH)
      .attr("y2", HEIGHT + MARGIN)
      .attr("stroke", "transparent");

    const leftGroup = svgLeft.append("g").attr("class", "points");

    svgLeft.on("click", function (event) {
      const [x, y] = d3.pointer(event);
      leftGroup.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 8)
        .attr("fill", "green");

      setLeftPoints((prev) => [...prev, { x: x.toFixed(1), y: y.toFixed(1) }]);
    });

    // === SVG DROIT ===
    const svgRight = d3.select(rightRef.current)
      .attr("viewBox", `0 ${-MARGIN} ${WIDTH + MARGIN} ${HEIGHT + 2 * MARGIN}`)
      .style("width", "100%")
      .style("height", "auto")
      .style("aspectRatio", `${WIDTH} / ${HEIGHT}`)
      .style("cursor", "crosshair")
      .style("display", "block");

    svgRight.selectAll("*").remove();

    svgRight.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", WIDTH)
      .attr("height", HEIGHT)
      .attr("fill", "#eaaa9e");

    // lignes visibles pour simuler le padding
    svgRight.append("line") // droite
      .attr("x1", WIDTH + MARGIN)
      .attr("y1", 0)
      .attr("x2", WIDTH + MARGIN)
      .attr("y2", HEIGHT)
      .attr("stroke", "transparent");

    svgRight.append("line") // haut
      .attr("x1", 0)
      .attr("y1", -MARGIN)
      .attr("x2", WIDTH)
      .attr("y2", -MARGIN)
      .attr("stroke", "transparent");

    svgRight.append("line") // bas
      .attr("x1", 0)
      .attr("y1", HEIGHT + MARGIN)
      .attr("x2", WIDTH)
      .attr("y2", HEIGHT + MARGIN)
      .attr("stroke", "transparent");

    const rightGroup = svgRight.append("g").attr("class", "points");

    svgRight.on("click", function (event) {
      const [x, y] = d3.pointer(event);
      rightGroup.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 8)
        .attr("fill", "red");

      setRightPoints((prev) => [...prev, { x: x.toFixed(1), y: y.toFixed(1) }]);
    });
  }, []);

  const resetPoints = () => {
    d3.select(leftRef.current).select(".points").selectAll("*").remove();
    d3.select(rightRef.current).select(".points").selectAll("*").remove();
    setLeftPoints([]);
    setRightPoints([]);
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
      <button
        onClick={resetPoints}
        style={{
          marginBottom: "1rem",
          padding: "8px 16px",
          backgroundColor: "#e74c3c",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Reset
      </button>

      {/* ZONES SVG */}
      <div style={{ display: "flex", gap: 0 }}>
        <svg ref={leftRef} style={{ width: "50%" }} />
        <svg ref={rightRef} style={{ width: "50%" }} />
      </div>

      {/* TABLES DE COORDONNÉES */}
      <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
        <div>
          <h3>Left</h3>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #ddd", padding: "6px" }}>X</th>
                <th style={{ borderBottom: "1px solid #ddd", padding: "6px" }}>Y</th>
              </tr>
            </thead>
            <tbody>
              {leftPoints.map((p, i) => (
                <tr key={i}>
                  <td style={{ padding: "6px" }}>{p.x}</td>
                  <td style={{ padding: "6px" }}>{p.y}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3>Right</h3>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #ddd", padding: "6px" }}>X</th>
                <th style={{ borderBottom: "1px solid #ddd", padding: "6px" }}>Y</th>
              </tr>
            </thead>
            <tbody>
              {rightPoints.map((p, i) => (
                <tr key={i}>
                  <td style={{ padding: "6px" }}>{p.x}</td>
                  <td style={{ padding: "6px" }}>{p.y}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProportionalRectangles;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graph_1 = require("./graph");
const astar_1 = require("./astar");
console.log('--- A* Algorithm Test Suite ---');
const runTests = () => {
    let passed = 0;
    let failed = 0;
    const assert = (condition, testName) => {
        if (condition) {
            console.log(`✅ PASS: ${testName}`);
            passed++;
        }
        else {
            console.error(`❌ FAIL: ${testName}`);
            failed++;
        }
    };
    // Test 1: Normal Route
    const graph1 = (0, graph_1.createMockNetwork)();
    const res1 = (0, astar_1.runAStar)(graph1, 'A', 'D');
    assert(res1.path.join(',') === 'A,B,D', 'Test 1: Normal Path (A -> B -> D)');
    assert(res1.distance === 20, 'Test 1: Correct Base Distance (20)');
    // Test 2: Severe Disruption on A->B
    const graph2 = (0, graph_1.createMockNetwork)();
    graph2.applyDisruption('A', 'B', Infinity);
    const res2 = (0, astar_1.runAStar)(graph2, 'A', 'D');
    assert(res2.path.join(',') === 'A,C,D', 'Test 2: Reroute Path (A -> C -> D)');
    assert(res2.distance === 35, 'Test 2: Correct Reroute Distance (35)');
    // Test 3: Multiple Disruptions
    const graph3 = (0, graph_1.createMockNetwork)();
    graph3.applyDisruption('A', 'B', Infinity);
    graph3.applyDisruption('C', 'D', Infinity);
    const res3 = (0, astar_1.runAStar)(graph3, 'A', 'D');
    assert(res3.path.join(',') === 'A,C,E,D', 'Test 3: Complex Reroute (A -> C -> E -> D)');
    assert(res3.distance === 35, 'Test 3: Correct Complex Reroute Distance (35)');
    // Test 4: Disconnected / No Path
    const graph4 = (0, graph_1.createMockNetwork)();
    graph4.applyDisruption('B', 'D', Infinity);
    graph4.applyDisruption('C', 'D', Infinity);
    graph4.applyDisruption('E', 'D', Infinity);
    const res4 = (0, astar_1.runAStar)(graph4, 'A', 'D');
    assert(res4.distance === Infinity, 'Test 4: Handle Disconnected Graph (Distance Infinity)');
    assert(res4.path.length === 0, 'Test 4: Handle Disconnected Graph (Empty Path)');
    console.log('-------------------------------');
    console.log(`Results: ${passed} Passed, ${failed} Failed`);
    if (failed > 0) {
        console.error('Some tests failed!');
    }
};
runTests();
//# sourceMappingURL=astar.test.js.map
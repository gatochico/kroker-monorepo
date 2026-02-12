import { useEffect, useRef, useContext, useState } from "react";
import { styled } from '@mui/material/styles';
import { selectorContext } from '../../contexts/selectorContext';
import { initTree, parseToTree,  } from "./graphUtils";
import './graphStyle.css';
import { clickMethod, calculateProportions } from './utils';
import { legend } from "./legend";
import Button from '@mui/material/Button';
const SvgContainer = styled('div')(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative'
}));

const LegendContainer = styled('div')(() => ({
  position: 'absolute',
  top: '0',
  right: '0',
  marginRight: '10px',
  marginTop: '10px',
}));

const StyledDiv = styled('div')(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  display: "flex",
  gap: '12px',
  margin: '12px',
}));


const Graph = () => {
  const ref = useRef();
  const containerRef = useRef();
  const legendRef = useRef();

  const {
    selectedClass,
    selectedTests,
    setSelectedAutomaticTests,
    setSelectedManualTests,
    selectedManualTests,
    selectedAutomaticTests,
    setSelectedMethod,
    setSelectedMethodClass,
    setMethodLine,
    setSelectedTab,
    selectedDataset,
    setMethodType,
  } = useContext(selectorContext);

  // CONSTS
  const [height, setHeight] = useState();
  const [width, setWidth] = useState();

  const [clickedCache, setClickedCache] = useState(new Set());
  const [root, setRoot] = useState(() => () => {});
  const [tree, setTree] = useState({});

  const [diagonal, setDiagonal] = useState(() => () => {});
  const [lastClicked, setLastClicked] = useState(null);
  const [lastExpanded, setLastExpanded] = useState(null);

  const [currentDataset, setCurrentDataset] = useState({ classname: null, dataset: null });
  const [usedData, setUsedData] = useState(null);
  const [colorData, setColorData] = useState({})

  const [allClicked, setAllClicked] = useState(false);

  const [lastClickedPresent, setLastClickedPresent] = useState(false);

  // -----

  const [treeFunc, setTreeFunc] = useState(() => () => {});

  function setsIntersection(set1, set2) {
    const intersection = new Set(
      [...set1].filter(element => {
        const auxSet = new Set([...set2]);
        return auxSet.has(element)
      }
      ));
    return intersection;
  }

  useEffect(() => {
    if (!selectedClass || !selectedDataset) return;
    setClickedCache(new Set());
    setAllClicked(false);
    setCurrentDataset(
      { classname: selectedClass, dataset: selectedDataset.callgraph[selectedClass] }
    )
  }, [selectedClass, selectedDataset])

  useEffect(() => {
    setHeight(containerRef.current.clientHeight);
    setWidth(containerRef.current.clientWidth);
  }, [containerRef])

  useEffect(() => {
    if (!(currentDataset.classname !== selectedClass)) return;
    const activeTests = Object.values(selectedTests).filter((n) => n.selected && n.color).map((n) => n.name);
    if (!activeTests.length) {
      setClickedCache(new Set())
    }
  }, [selectedTests, currentDataset, selectedClass]);

  useEffect(() => {
    if (currentDataset.classname !== selectedClass) return;
    const newData =  JSON.parse(JSON.stringify(currentDataset.dataset))
    const activeTests = Object.values(selectedTests).filter((n) => n.selected && n.color).map((n) => n.name.name);
    newData.nodes = newData.nodes.filter((n) => {
      const nodeTests = n.tests[selectedClass].map((n) => n.name)
      const intersects = setsIntersection(activeTests, nodeTests);
      return intersects.size || n.id === 0;
    })

    newData.links = newData.links.filter(
      (l) => {
        const cond1 = l.source === 0 || clickedCache.has(l.source) || allClicked;
        const linkTests = l.tests[selectedClass].map((n) => n.name);
        
        const intersects = setsIntersection(activeTests, linkTests);
        const cond2 = intersects.size
        return cond1 && cond2
      }
    );

    const colors = calculateProportions(
      newData.nodes,
      selectedClass,
      selectedTests,
      selectedDataset.methodlimits,
      selectedDataset.linecoverage
    );
    setColorData(colors);
    if (lastClicked) {
      const ids = newData.nodes.map((el) => el.id)
      if (ids.includes(lastClicked.data.id)) {
        setLastClickedPresent(true)
      } else {
        setLastClickedPresent(false)
        setLastClicked(null);
      }
    } else {
      setLastClickedPresent(false);
    }

    setUsedData(parseToTree(newData));
  }, [clickedCache, currentDataset, selectedTests, selectedClass, selectedDataset, lastClicked]);

  const clickFullPath = (clicked) => {
    const toAdd = new Set();
    const newData =  JSON.parse(JSON.stringify(currentDataset.dataset))
    const children = [clicked.id];
    while (children.length) {
      const actual = children.pop();
      toAdd.add(actual)
      const actualchildren = newData.links.filter((l) => l.source == actual).map((l) => l.target);
      children.push(...actualchildren)
    }
    return toAdd;
  };

  const removeTest = (clicked) => {
    const testName = clicked.data.name.split('(')[0].toLowerCase();
    const testType = selectedTests[testName].name.type;
    if (testType === "Manual") {
      const newTests = { ...selectedManualTests };
      newTests[testName].selected = false;
      newTests[testName].color = null;
      setSelectedManualTests(newTests)
    } else {
      //
      const newTests = { ...selectedAutomaticTests };
      newTests[testName].selected = false;
      newTests[testName].color = null;
      setSelectedAutomaticTests(newTests)
    }
  }

  useEffect(() => {
    if (!usedData) return;
    initTree(usedData.tree, usedData.missing, 
      { 
        width,
        height,
        tree: treeFunc,
        setTree: setTreeFunc,
        diagonal,
        setDiagonal,
        svgRef: ref,
        root,
        setRoot,
        originalDataset: currentDataset.dataset,
        lastClicked,
        setLastClicked,
        lastExpanded,
        setLastExpanded,
        clickedCache,
        setClickedCache,
        colorData,
        setAllClicked,
        clickFullPath,
        removeTest,
        lastClickedPresent,
        setLastClickedPresent,
      }
    )
    legend(legendRef);
  }, [
    usedData,
    height,
    width,
    lastClicked,
    colorData,
    clickedCache,
    currentDataset,
    diagonal,
    lastExpanded,
    lastClickedPresent,
  ]);

  useEffect(() => {
    // console.log("miau", lastClicked)
    if (!lastClicked) {
      clickMethod(
        null,
        setSelectedMethod,
        setSelectedMethodClass,
        setMethodLine,
        setSelectedTab,
        setMethodType,
        selectedDataset.methodlimits,
        selectedDataset.testmethodlimits,
      );
      return
    }
    const node = lastClicked.data;
    clickMethod(
      node,
      setSelectedMethod,
      setSelectedMethodClass,
      setMethodLine,
      setSelectedTab,
      setMethodType,
      selectedDataset.methodlimits,
      selectedDataset.testmethodlimits,
    )
  }, [lastClicked]);

  const clickAll = () => {
    setClickedCache(new Set());
    setAllClicked(!allClicked);
  };

  return (
    <>
      <SvgContainer ref={containerRef} id='svgcontainer'>
        <svg ref={ref}/>
        <LegendContainer>
          <svg ref={legendRef}/>
        </LegendContainer>
        {
          Object.values(selectedTests).some((t) => t.selected && t.color) && 
          (
            <StyledDiv>
              <Button id="expandbutton" size="small" variant="contained" disableElevation onClick={clickAll}>
                { allClicked ? "Shrink All -" : "Expand All +"}
              </Button>
              
              <Button id="zoomoutButton" size="small" variant="contained" disableElevation sx={{ backgroundColor: "purple" }}>
                Zoom -
              </Button>

              <Button id="zoominButton" size="small" variant="contained" disableElevation sx={{ backgroundColor: "purple" }}>
                Zoom +
              </Button>
            </StyledDiv>
          )
         
        }
        <ul className='custom-menu'>
          <li data-action="one" className="menu-item">Expand one level</li>
          <li data-action="all" className="menu-item">Expand full path</li>
        </ul>
        <ul className='custom-menu-test'>
          <li data-action="one" className="menu-item">Expand one level</li>
          <li data-action="all" className="menu-item">Expand full path</li>
          <li data-action="remove" className="menu-item">Remove Test</li>
        </ul>

        <ul className='remove-menu-test'>
          <li data-action="compress" className="menu-item">Compress levels</li>
          <li data-action="remove" className="menu-item">Remove Test</li>
        </ul>
      </SvgContainer>
    </>
  )
}
export default Graph
    
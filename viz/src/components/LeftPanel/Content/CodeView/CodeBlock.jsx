import { useState, useContext, useEffect, useRef } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { backgroundColors } from '../../../../constants/constants';

import { selectorContext } from '../../../../contexts/selectorContext';
import { getColorLines } from './utils';

const CodeBlock = () => {
  const ref = useRef();
  const [text, setText] = useState("");
  const [coveredLines, setCoveredLines] = useState({
    green: [],
    groupA: [],
    groupB: [],
    red: [],
  });
  const [methodStartAndLength, setMethodStartAndLength] = useState();
  const [stateMethodLimits, setStateMethodLimits] = useState();
  const [selectedTestGroup, setSelectedTestGroup] = useState(null);

  const {
    selectedMethodClass,
    selectedMethod,
    methodLine,
    selectedClass,
    selectedTests,
    selectedDataset,
    methodType,
  } = useContext(selectorContext);

  useEffect(() => {
    if (methodType !== 'T') {
      setSelectedTestGroup(null);
      return;
    }
    const color = selectedTests[selectedMethod.split('(')[0].toLowerCase()];
    setSelectedTestGroup(color.color);
  }, [selectedMethod, methodType, selectedTests]);

  useEffect(() => {
    if (!selectedDataset?.methodlimits && !selectedDataset?.testmethodlimits) return;
    const { methodlimits, testmethodlimits } = selectedDataset;
    if (methodType !== 'T' && methodlimits[selectedMethodClass] && methodlimits[selectedMethodClass][selectedMethod]) {
      const methodData = methodlimits[selectedMethodClass][selectedMethod];
      setMethodStartAndLength([methodData.start , methodData.length ])
    } else if (methodType === 'T' && testmethodlimits[selectedMethodClass] && testmethodlimits[selectedMethodClass][selectedMethod]) {
      const methodData = testmethodlimits[selectedMethodClass][selectedMethod];
      setMethodStartAndLength([methodData.start , methodData.length ])
    } else {
      setMethodStartAndLength(null)
    }
  }, [selectedMethodClass, selectedMethod, selectedDataset, methodType])

  useEffect(() => {
    if (!selectedMethodClass || !selectedMethod || !selectedDataset) {
      setText("");
      return;
    }
    if (!selectedDataset?.codefiles || !selectedDataset?.codefiles[selectedMethodClass]) {
      setText("Code not found.");
      return;
    }
    fetch(selectedDataset?.codefiles[selectedMethodClass])
    .then((response) => response.text())
    .then((textContent) => {
      setText(textContent);
    });

    // select class and file
    const fileData = selectedDataset?.linecoverage[selectedMethodClass];
    if (fileData) {
      const lineColor = getColorLines(fileData, selectedClass, selectedTests)
      setCoveredLines(lineColor)
    } else {
      setCoveredLines({
        green: [],
        groupB: [],
        groupA: [],
        red: [],
      })
    }
  }, [selectedMethodClass, selectedMethod, selectedClass, selectedTests, selectedDataset])

  useEffect(() => {
    if (!methodStartAndLength) {
      setStateMethodLimits(null);
      return
    }
    const x = document.getElementsByClassName("react-syntax-highlighter-line-number")
    if (!methodLine && x.length) {
      setStateMethodLimits(null);
      x[0].scrollIntoView({ behavior: "smooth"})
    }
    let countedLines = 0;
    let currentLine = methodStartAndLength[0]
    // console.log("method type", methodType);
    if (methodType !== 'T') {
      // console.log("method wasnt t")
      // console.log(coveredLines)
      while (countedLines < methodStartAndLength[1]) {
        if (
          coveredLines.green.includes(currentLine) ||
          coveredLines.groupA.includes(currentLine) ||
          coveredLines.groupB.includes(currentLine) ||
          coveredLines.red.includes(currentLine)
        ) countedLines++;
        currentLine++;

        // console.log("this is a method counter")
        // console.log("countedlines", countedLines, "currentLine", currentLine)
        if (countedLines === 0) {
          break;
        }
      }
    } else {
      while (countedLines < methodStartAndLength[1]) {
        countedLines++;
        currentLine++;
        // console.log("this is a test counter")
        // console.log("countedlines", countedLines, "currentLine", currentLine)
      }
    }
    setStateMethodLimits([methodStartAndLength[0], currentLine])
    for (let i = 0; i < x.length; i++) {
      const newText = x[i].textContent
      if (newText == methodLine) {
        x[i - 5].scrollIntoView({ behavior: "smooth"});
        return;
      }
    }
    
  }, [methodLine, text, coveredLines, methodStartAndLength, methodType])

  return (
    <div ref={ref}>
      <SyntaxHighlighter  
        customStyle={{ display: 'flex', backgroundColor: 'transparent', width: 'auto', overflowX: 'undefined'}}
        language="java"
        style={docco}
        showLineNumbers
        showInlineLineNumbers
        wrapLines={true}
        lineProps={ (linenumber) => {
          let style = { display: 'block' };
          if (coveredLines.green.length && coveredLines.green.includes(linenumber)) {
            style.backgroundColor = backgroundColors.Both; // green
          } else if (coveredLines.groupA.length && coveredLines.groupA.includes(linenumber)) {
            style.backgroundColor = backgroundColors.GroupA; // 
          } else if (coveredLines.groupB.length && coveredLines.groupB.includes(linenumber)) {
            style.backgroundColor = backgroundColors.GroupB; // purple
          } else if (coveredLines.red.length && coveredLines.red.includes(linenumber)) {
            style.backgroundColor = backgroundColors.None; // red
          } 
        
          if ( stateMethodLimits ) {
            // console.log("paint", stateMethodLimits)
            if (linenumber < stateMethodLimits[0] - 2 || linenumber > stateMethodLimits[1]) {
              style.opacity = 0.2
            } else if (selectedTestGroup) {
             if (selectedTestGroup === "groupA") style.backgroundColor = backgroundColors.GroupA;
             if (selectedTestGroup === "groupB") style.backgroundColor = backgroundColors.GroupB;
            }
          } else {
            style.opacity = 1;
          }
          return { style };
        }}  
        >
        {text}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
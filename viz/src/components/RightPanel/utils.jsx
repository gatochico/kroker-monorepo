import { defaultData, groupBTest, groupATest } from "./pieData";

export const setsIntersection = (set1, set2)  => {
  const intersection = new Set([...set1].filter(element => set2.has(element)));
  return intersection;
 };

export const clickMethod = (d, setSelectedMethod, setSelectedMethodClass, setMethodLine, setSelectedTab, setMethodType, methodRefs, testmethodRefs) => {
  // console.log("clic")
  // console.log(d)
  // console.log(methodRefs)
  // console.log(testmethodRefs)


  if (!d) {
    setSelectedMethodClass('');
    setSelectedMethod('');
    setSelectedTab(0);
    setMethodLine(0);
    setMethodType("");
    return;
  }
// 
  const classname = d.file.split("$")[0];
  // console.log(classname)
  setSelectedMethodClass(classname);
  setSelectedMethod(d.name);
  
  setMethodType(d.type);
  setSelectedTab(1);

  // console.log("gup")
  if ((d.type !== "T" && !methodRefs[classname]) || (d.type === "T" && !testmethodRefs[classname])) {
    setMethodLine(0); 
    return;
  }
  const x = d.type === 'T' ? testmethodRefs[classname][d.name] : methodRefs[classname][d.name];
  if (x) {
    setMethodLine(x.start)
  } else {
    setMethodLine(0); 
  }
}

export const calculateProportions = (nodes, activeClass, activeTests, methodRefs, colorData) => {

  const groupATestArray = new Set(Object.values(activeTests)
    .filter((t) => t.selected && t.color === "groupA").map((t) => t.name.name.toLowerCase()))
  const groupBTestArray = new Set(Object.values(activeTests)
    .filter((t) => t.selected && t.color === "groupB").map((t) => t.name.name.toLowerCase()))

  const percentages = {};
  nodes.forEach((node) => {
    const filename = node.file.split("$")[0]
    const fileData = methodRefs[filename]
    if (node.type === "T") {
      percentages[node.id] = groupATestArray
        .has(node.tests[activeClass][0].name.toLowerCase()) ? groupATest : groupBTest;
      return;
    }

    if (filename === "Routes") {
      percentages[node.id] = defaultData;
      return;
    }

    if (!fileData) {
      percentages[node.id] = defaultData;
      return;
    }
    const methodData = fileData[node.name];
    if (!methodData) {
      percentages[node.id] = defaultData;
      return;
    }
    const fileLines = colorData[filename];
    let both = 0;
    let groupA = 0;
    let groupB = 0;
    let neither = 0;
    
    let currentLineNumber = 0;
    let contableLineNumber = 0;
    while (contableLineNumber < methodData.length){
      const currentLine = fileLines[methodData.start + currentLineNumber];
      let checked = false;
      const selectedClassCoverage = currentLine.tests[activeClass];
      if (selectedClassCoverage.Automatic.fc || selectedClassCoverage.Manual.fc) {
        const lowercasedAutomatic = selectedClassCoverage.Automatic.fc.map(
          (t) => t.toLowerCase()
        ) ;
        const lowercasedManual= selectedClassCoverage.Manual.fc.map(
          (t) => t.toLowerCase()
        );
        const lowercasedAutomaticPc = selectedClassCoverage.Automatic.pc.map(
          (t) => t.toLowerCase()
        ) ;
        const lowercasedManualPc = selectedClassCoverage.Manual.pc.map(
          (t) => t.toLowerCase()
        );
        const groupACheck = !!(
          setsIntersection(lowercasedAutomatic, groupATestArray).size ||
          setsIntersection(lowercasedManual, groupATestArray).size || 
          setsIntersection(lowercasedAutomaticPc, groupATestArray).size ||
          setsIntersection(lowercasedManualPc, groupATestArray).size
          )
        const groupBCheck = !!(
          setsIntersection(lowercasedAutomatic, groupBTestArray).size ||
          setsIntersection(lowercasedManual, groupBTestArray).size ||
          setsIntersection(lowercasedAutomaticPc, groupBTestArray).size ||
          setsIntersection(lowercasedManualPc, groupBTestArray).size
          )

        if (groupACheck && groupBCheck) {
          contableLineNumber++;
          both++;
          checked = true;
        } else if (groupACheck) {
          contableLineNumber++;
          groupA++;
          checked = true;
        } else if (groupBCheck) {
          contableLineNumber++;
          groupB++;
          checked = true;
        }
      } if (!checked && (selectedClassCoverage.Automatic.nc || selectedClassCoverage.Manual.nc)) {
        const lowercasedAutomatic = selectedClassCoverage.Automatic.nc.map(
          (t) => t.toLowerCase()
        ) ;
        const lowercasedManual= selectedClassCoverage.Manual.nc.map(
          (t) => t.toLowerCase()
        );
        const groupACheck = !!(setsIntersection(
          lowercasedAutomatic, groupATestArray).size ||
          setsIntersection(lowercasedManual, groupATestArray).size
          )
        const groupBCheck = !!(setsIntersection(
          lowercasedAutomatic, groupBTestArray).size ||
          setsIntersection(lowercasedManual, groupBTestArray).size
          )

        if (groupACheck && groupBCheck) {
          contableLineNumber++;
          neither++;
          checked = true;
        } else if (groupACheck) {
          contableLineNumber++;
          neither++;
          checked = true;
        } else if (groupBCheck) {
          contableLineNumber++;
          neither++;
          checked = true;
        }
      } 
      currentLineNumber++;
    }
    const sum = both+groupA+groupB+neither;
    percentages[node.id] = [
      { "color": "Both", "percent": 100*both/sum },
      { "color": "GroupA", "percent": 100*groupA/sum },
      { "color": "GroupB", 'percent': 100*groupB/sum },
      { "color": "None", 'percent': 100*neither/sum },
    ];
  })
  return percentages
};
const intersection = (array1, array2) => {
    const lowerArray1 = array1.map((a) => a.toLowerCase())
    const lowerArray2 = array2.map((a) => a.toLowerCase())
    const filteredArray = lowerArray1.filter(value => lowerArray2.includes(value));

    return filteredArray.length;
}

export const getColorLines = (fileData, selectedClass, selectedTests) => {
    const selectedTestsList = Object.values(selectedTests)
        .filter((t) => t.selected)
        .map((t) => ({...t.name, color: t.color}));
    const selectedAutomaticGroupAList = selectedTestsList
        .filter((t) => t.type === "Automatic" && t.color === "groupA").map((t) => t.name);
    const selectedAutomaticGroupBList = selectedTestsList
        .filter((t) => t.type === "Automatic" && t.color === "groupB").map((t) => t.name);
    const selectedManualGroupAList = selectedTestsList
        .filter((t) => t.type === "Manual" && t.color === "groupA").map((t) => t.name);
    const selectedManualGroupBList = selectedTestsList
        .filter((t) => t.type === "Manual" && t.color === "groupB").map((t) => t.name);

    const greenLines = [];
    const groupALines = [];
    const groupBLines = [];
    const redLines = [];

    Object.entries(fileData).forEach(([line, value]) => {
        const { Automatic: automatic, Manual: manual } = value.tests[selectedClass]
        if (automatic && manual) {
            if (
                (
                    (automatic.fc.length && intersection(selectedAutomaticGroupAList, automatic.fc)) ||
                    (manual.fc.length && intersection(selectedManualGroupAList, manual.fc)) ||
                    (automatic.pc.length && intersection(selectedAutomaticGroupAList, automatic.pc)) ||
                    (manual.pc.length && intersection(selectedManualGroupAList, manual.pc))
                ) && 
                (
                    (automatic.fc.length && intersection(selectedAutomaticGroupBList, automatic.fc)) ||
                    (manual.fc.length && intersection(selectedManualGroupBList, manual.fc)) ||
                    (automatic.pc.length && intersection(selectedAutomaticGroupBList, automatic.pc)) ||
                    (manual.pc.length && intersection(selectedManualGroupBList, manual.pc))
                )
            ) {
                greenLines.push(+line);
            } else if (
                (automatic.fc.length && intersection(selectedAutomaticGroupAList, automatic.fc)) ||
                (manual.fc.length && intersection(selectedManualGroupAList, manual.fc)) ||
                (automatic.pc.length && intersection(selectedAutomaticGroupAList, automatic.pc)) ||
                (manual.pc.length && intersection(selectedManualGroupAList, manual.pc))
            ) {
                groupALines.push(+line);
            } else if (
                (automatic.fc.length && intersection(selectedAutomaticGroupBList, automatic.fc)) ||
                (manual.fc.length && intersection(selectedManualGroupBList, manual.fc)) ||
                (automatic.pc.length && intersection(selectedAutomaticGroupBList, automatic.pc)) ||
                (manual.pc.length && intersection(selectedManualGroupBList, manual.pc))
            ) {
                groupBLines.push(+line);
            } else if (
                (
                    (automatic.nc.length && intersection(selectedAutomaticGroupAList, automatic.nc)) ||
                    (manual.nc.length && intersection(selectedManualGroupAList, manual.nc))
                ) || 
                (
                    (automatic.nc.length && intersection(selectedAutomaticGroupBList, automatic.nc)) ||
                    (manual.nc.length && intersection(selectedManualGroupBList, manual.nc))
                )
            ) {
                redLines.push(+line);
            }
        }
    })

    return {
        green: greenLines,
        groupA: groupALines,
        groupB: groupBLines,
        red: redLines,
    }
}
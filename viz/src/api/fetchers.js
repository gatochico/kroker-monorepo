import { datasetKeys } from './constants';
import codefiles from '../assets/datasets/SparkCode/index';

// const BASE_URL = 'https://chan.ing.puc.cl/vistests'
// const BASE_URL = 'http://localhost:6655/vistests';
const BASE_URL = import.meta.env.VITE_BASE_URL;
// const BASE_URL = 'https://kroker-server.onrender.com/vistests';

export const getDatasets = async (dataset, setFunction) => {
    console.log(BASE_URL)
    const name = datasetKeys[dataset]
    const [callgraph, linecoverage, methodlimits, testoptions, testmethodlimits] = await Promise.all([
      fetch(`${BASE_URL}/callgraph/${name}`).then(response => response.json()),
      fetch(`${BASE_URL}/linecoverage/${name}`).then(response => response.json()),
      fetch(`${BASE_URL}/methodlimits/${name}`).then(response => response.json()),
      fetch(`${BASE_URL}/testoptions/${name}`).then(response => response.json()),
      fetch(`${BASE_URL}/testmethodlimits/${name}`).then(response => response.json()),
    ]);

    setFunction({
      callgraph,
      codefiles,
      linecoverage,
      methodlimits,
      testoptions,
      testmethodlimits,
    });      
}

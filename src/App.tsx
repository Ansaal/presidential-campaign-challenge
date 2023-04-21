import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Autocomplete,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import Papa from 'papaparse';
import { ChangeEvent, useState } from 'react';

import DynamicProgrammingTSP from './algorithms/DynamicProgrammingTSP';
import MinimumSpanningTreeTSP from './algorithms/MinimumSpanningTreeTSP';
import NearestInsertionTSP from './algorithms/NearestInsertionTSP';
import NearestNeighbourTSP from './algorithms/NearestNeighbourTSP';
import { TSPAlgorithm, TSPResult } from './algorithms/TSPAlgorithm';
import City from './domain/city';

function App() {
  const algorithms: Array<TSPAlgorithm> = [
    new NearestInsertionTSP(),
    new NearestNeighbourTSP(),
    new MinimumSpanningTreeTSP(),
    new DynamicProgrammingTSP(),
  ];

  const [cities, setCities] = useState<City[]>([]);
  const [startingCity, setStartingCity] = useState<City | undefined>(undefined);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<TSPAlgorithm>(algorithms[0]);
  const [result, setResult] = useState<TSPResult | undefined>(undefined);

  const changeStartingCity = (city: City | undefined) => {
    setStartingCity(city);
  };

  const handleAlgorithmChange = (event: ChangeEvent, value: string) => {
    const tspAlgorithm =
      algorithms.find((algorithm) => algorithm.name === value) || algorithms[0];
    setSelectedAlgorithm(tspAlgorithm);
  };

  const openFileDialog = async () => {
    //Use of chrome native api
    const [fileHandle] = await (window as any).showOpenFilePicker();
    const file = await fileHandle.getFile();
    const contents = await file.text();
    try {
      const csvData: Array<Array<string>> = Papa.parse(contents)?.data as Array<
        Array<string>
      >;
      csvData.shift();
      csvData.pop();
      setCities(
        csvData
          .filter((entry) => entry.length === 4)
          .map((entry) => {
            return {
              name: entry[0],
              state: entry[1],
              latitude: parseFloat(entry[2]),
              longitude: parseFloat(entry[3]),
            } as City;
          }),
      );
    } catch (e) {
      console.error('Can not read csv file');
    }
  };

  const start = async () => {
    if (!selectedAlgorithm) {
      return;
    }
    const tspResult = await selectedAlgorithm.calculate(cities, startingCity as City);
    setResult(tspResult);
  };

  return (
    <>
      <AppBar color="primary" position="static">
        <Container maxWidth="xl">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Presidential Campaign Route Calculator
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>

      <Grid container spacing={3} sx={{ marginTop: 5, marginX: 3 }}>
        <Grid item xs={7} sx={{ paddingX: 3 }}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Cities
              </Typography>
              <Grid container>
                <Grid item xs={5}>
                  <Button
                    variant="contained"
                    sx={{ marginTop: 1 }}
                    onClick={openFileDialog}
                  >
                    {cities.length < 1 ? 'Import Cities' : 'Import again'}
                  </Button>
                </Grid>
                <Grid item xs={5}>
                  <Autocomplete
                    disabled={cities.length < 1}
                    disablePortal
                    id="chooseStartingCity"
                    getOptionLabel={(city) => city.name}
                    onChange={(event, value) => changeStartingCity(value ?? undefined)}
                    options={cities}
                    sx={{ width: 300 }}
                    renderOption={(props, option) => {
                      return (
                        <li {...props} key={option.name + option.state}>
                          {option.name}
                        </li>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Starting City" />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3} sx={{ paddingX: 3 }}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Algorithm
              </Typography>
              <FormControl>
                <RadioGroup
                  name="radio-buttons-group"
                  value={selectedAlgorithm.name}
                  onChange={handleAlgorithmChange}
                >
                  {algorithms.map((algorithm) => {
                    return (
                      <FormControlLabel
                        key={algorithm.name}
                        value={algorithm.name}
                        control={<Radio />}
                        label={algorithm.name}
                      />
                    );
                  })}
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={10} sx={{ paddingX: 3 }}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Result
              </Typography>
              <Button
                variant="contained"
                disabled={!(startingCity && selectedAlgorithm)}
                onClick={start}
              >
                Calculate Route
              </Button>
              {result && (
                <div>
                  <Typography gutterBottom variant="h6" component="div">
                    Distance: {result.distance} km
                  </Typography>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>Order:</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {result &&
                          result.order.map((city, index) => (
                            <ListItem key={index}>
                              <ListItemText>{city.name}</ListItemText>
                            </ListItem>
                          ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default App;

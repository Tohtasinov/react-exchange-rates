import React, { useEffect, useState } from "react";
import axios from "axios";

import theme from "./theme";
import ExchangesList from "./components/ExchangeList/ExchangeList";
import Header from "./components/Header/Header";
import Calculator from "./components/Calculator/Calculator";

import {
  CssBaseline,
  Grid,
  Paper,
  ThemeProvider,
  Toolbar,
} from "@mui/material";

const CURRENCIES = ["EUR", "USD", "KGS", "KZT", "RUB"];

const API_WITH_BASE_CURRENCY = (baseCurrency) =>
  `https://v6.exchangerate-api.com/v6/9bb01ff3aef3bba9cab4cea2/latest/${baseCurrency}`;

function App() {
  const [baseCurrency, setBaseCurrency] = useState("KGS");
  const [allCurrencies, setAllCurrencies] = useState({});

  const handleBaseCurrencyChange = (event) => {
    setBaseCurrency(event.target.value);
  };

  const fetchRates = async (base) => {
    const response = await axios.get(API_WITH_BASE_CURRENCY(base));

    const onlyNeedCurrencies = Object.entries(
      response.data.conversion_rates
    ).reduce((acc, [key, value]) => {
      // console.log("acc: ", acc);
      // console.log("key: ", key);
      // console.log("value: ", value);
      // console.log("- - - - - - - - - - - - - - - - - - - - - - -");

      if (CURRENCIES.includes(key) && base !== key) {
        return {
          ...acc,
          [key]: value,
        };
      } else return acc;
    }, {});

    setAllCurrencies(onlyNeedCurrencies);
  };

  useEffect(() => {
    fetchRates(baseCurrency);
  }, [baseCurrency]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header
        baseCurrency={baseCurrency}
        onBaseCurrencyChange={handleBaseCurrencyChange}
      />
      <Toolbar />

      <Grid sx={{ margin: "50px" }} container justifyContent="space-around">
        <Grid item>
          <Calculator />
        </Grid>
        <Grid item>
          <Paper
            elevation={2}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <ExchangesList currencies={allCurrencies} />
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;

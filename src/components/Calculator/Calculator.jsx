// /* eslint-disable no-unreachable */
// import React from "react";
// // import PropTypes from "prop-types";
// import Paper from "@mui/material/Paper";
// import Grid from "@mui/material/Grid";

// const Calculator = () => {
//   return;
//   <Paper>
//     <Grid container>
//       <Grid item xs={12}>
//         <TextField
//       </Grid>
//     </Grid>
//   </Paper>;
// };

// Calculator.propTypes = {};

// export default Calculator;

/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

import OutlinedInput from "@mui/material/OutlinedInput";
// or
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import { MenuItem } from "@mui/material";

const API_KEY = "9bb01ff3aef3bba9cab4cea2";

const API_WITH_BASE_CURRENCY = (baseCurrency) =>
  `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`;

const API_CALCULATE = (from, to, amount) =>
  `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${from}/${to}/${amount}`;

const ALL_CURRENCIES = ["KGS", "USD", "EUR", "KZT", "RUB"];

function Calculator() {
  const [baseCurrency, setBaseCurrency] = useState("KGS");
  const [conversionRates, setConversionRates] = useState({});
  const [firstAmount, setFirstAmount] = useState("");
  const [secondAmount, setSecondAmount] = useState("");
  const [firstCurrency, setFirstCurrency] = useState("KGS");
  const [secondCurrency, setSecondCurrency] = useState("USD");

  useEffect(() => {
    getRates(baseCurrency);
  }, [baseCurrency]);

  const getRates = async (base) => {
    try {
      const response = await fetch(API_WITH_BASE_CURRENCY(base));
      const data = await response.json();
      setConversionRates(data.conversion_rates);
    } catch (error) {
      console.error("Error fetching conversion rates:", error);
    }
  };

  const handleFirstAmountChange = (e) => {
    setFirstAmount(e.target.value);
    calculate("first", e.target.value);
  };

  const handleSecondAmountChange = (e) => {
    setSecondAmount(e.target.value);
    calculate("second", e.target.value);
  };

  const calculate = async (type, inputAmount) => {
    try {
      let fromCurrency, toCurrency, resultSetter;
      if (type === "first") {
        fromCurrency = firstCurrency;
        toCurrency = secondCurrency;
        resultSetter = setSecondAmount;
      } else {
        fromCurrency = secondCurrency;
        toCurrency = firstCurrency;
        resultSetter = setFirstAmount;
      }

      const response = await fetch(
        API_CALCULATE(fromCurrency, toCurrency, inputAmount)
      );
      const data = await response.json();

      if (type === "first") {
        setSecondAmount(data.conversion_result);
      } else {
        setFirstAmount(data.conversion_result);
      }
    } catch (error) {
      console.error("Error calculating conversion:", error);
    }
  };

  return (
    <div>
      <h2>Currency Calculator</h2>
      <div>
        <TextField
          id="outlined-number"
          label="Number"
          InputLabelProps={{
            shrink: true,
          }}
          value={firstAmount}
          onChange={handleFirstAmountChange}
        />
        <Select
          value={firstCurrency}
          onChange={(e) => setFirstCurrency(e.target.value)}
        >
          {ALL_CURRENCIES.map((currency) => (
            <MenuItem key={currency} value={currency}>
              {currency}
            </MenuItem>
          ))}
        </Select>
        <TextField
          id="outlined-number"
          label="Number"
          InputLabelProps={{
            shrink: true,
          }}
          type="number"
          value={secondAmount}
          onChange={handleSecondAmountChange}
        />
        <Select
          value={secondCurrency}
          onChange={(e) => setSecondCurrency(e.target.value)}
        >
          {ALL_CURRENCIES.map((currency) => (
            <MenuItem key={currency} value={currency}>
              {currency}
            </MenuItem>
          ))}
        </Select>
      </div>
    </div>
  );
}

export default Calculator;

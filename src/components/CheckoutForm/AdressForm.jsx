import React, { useState, useEffect } from "react";
import {
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
} from "@material-ui/core";
import { useForm, FormProvider } from "react-hook-form";
import { commerce } from "../../lib/commerce";

import FormInput from "./CustomTextField";
import { Code, ContactsOutlined } from "@material-ui/icons";

const AdressForm = ({ checkoutToken }) => {

    //constants
  const methods = useForm();

  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState("");

  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [shippingSubdivision, setShippingSubdivision] = useState("");

  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState("");

  const fetchShippingCountries = async (checkoutTokenId) => {
    const { countries } = await commerce.services.localeListShippingCountries(
      checkoutTokenId
    );


    setShippingCountries(countries);
    setShippingCountry(Object.keys(countries)[0])

    console.log(countries);
  };

  const countries = Object.entries(shippingCountries).map(([code, name]) => ({id: code, label: name}))
  console.log(countries)

  //useffects

  useEffect(() => {
    fetchShippingCountries(checkoutToken.id);
  }, []);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping Adress
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit="">
          <Grid container spacing={3}>
            <FormInput required name="firstName" label="First name" />
            <FormInput required name="lastName" label="Last name" />
            <FormInput required name="address1" label="Address" />
            <FormInput required name="email" label="E-mail" />
            <FormInput required name="city" label="City" />
            <FormInput required name="zipcode" label="Postal code" />
            
            <Grid item xs={12} sm={6}>
                <InputLabel>Shipping Country</InputLabel>
                <Select value={shippingCountry} fullWidth onChange={(e)=>setShippingCountry(e.target.value)}>
                      {countries.map((country) => (                  
                    <MenuItem key={country.id} value={country.id}>
                        {country.label}
                    </MenuItem>
                      ))}
                </Select>
            </Grid>
            {/* <Grid item xs={12} sm={6}>
                <InputLabel>Shipping Subdivision</InputLabel>
                <Select value='' fullWidth onChange={}>
                    <MenuItem key={} value={}>
                        Select me
                    </MenuItem>
                </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
                <InputLabel>Shipping Options</InputLabel>
                <Select value='' fullWidth onChange={}>
                    <MenuItem key={} value={}>
                        Select me
                    </MenuItem>
                </Select>
            </Grid> */}
          </Grid>
        </form>
      </FormProvider>
    </>
  );
};

export default AdressForm;
